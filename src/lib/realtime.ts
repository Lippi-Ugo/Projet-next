import type { Viewer } from '@/hooks/use-presence';

export type RealtimeEvents = {
    'presence:drop': { dropId: number; viewers: Viewer[] };
    'presence:online': { users: Viewer[] };
    'like:updated': { dropId: number; likesCount: number };
};

type EventName = keyof RealtimeEvents;
type Listener<Type extends EventName> = (data: RealtimeEvents[Type]) => void;
type ServerMessage =
    | { type: 'hello'; data: { online: Viewer[] } }
    | { type: 'presence:drop'; data: RealtimeEvents['presence:drop'] }
    | { type: 'presence:online'; data: RealtimeEvents['presence:online'] }
    | { type: 'like:updated'; data: RealtimeEvents['like:updated'] };

const NO_RECONNECT = [4001, 4008, 4009];
const CLOSE_DELAY_MS = 1000;

const listeners: { [Type in EventName]: Set<Listener<Type>> } = {
    'presence:drop': new Set(),
    'presence:online': new Set(),
    'like:updated': new Set(),
};
const latest: Partial<RealtimeEvents> = {};
const openListeners = new Set<() => void>();

let socket: WebSocket | null = null;
let connecting = false;
let consumers = 0;
let attempt = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

function scheduleReconnect() {
    attempt += 1;
    reconnectTimer = setTimeout(connect,
        Math.min(1000 * Math.pow(2, attempt), 30000)
    );
}

async function connect() {
    reconnectTimer = undefined;
    if (socket || connecting || consumers === 0) return;
    connecting = true;
    try {
        const res = await fetch('/api/realtime/ticket',
            { method: 'POST' });
        if (!res.ok) return;
        const { url } = await res.json();
        if (consumers === 0 || socket) return;
        open(url);
    } catch {
        if (consumers > 0) scheduleReconnect();
    } finally {
        connecting = false;
    }
}

function open(url: string) {
    const ws = new WebSocket(url);
    socket = ws;
    ws.onopen = () => {
        attempt = 0;
        openListeners.forEach((listener) => listener());
    };
    ws.onmessage = (event) => {
        const message: ServerMessage = JSON.parse(event.data);
        if (message.type === 'hello') {
            publishOnline(message.data.online);
        } else if (message.type === 'presence:online') {
            publishOnline(message.data.users);
        } else if (message.type === 'presence:drop') {
            listeners['presence:drop'].forEach((listener) => listener(message.data));
        } else if (message.type === 'like:updated') {
            listeners['like:updated'].forEach((listener) => listener(message.data));
        }
    };
    ws.onclose = (event) => {
        if (socket === ws) {
            socket = null;
            delete latest['presence:online'];
        }
        if (consumers === 0 || NO_RECONNECT.includes(event.code)) return;
        scheduleReconnect();
    };
}

function disconnect() {
    clearTimeout(reconnectTimer);
    reconnectTimer = undefined;
    socket?.close(1000);
    socket = null;
    delete latest['presence:online'];
}

export function retain() {
    clearTimeout(closeTimer);
    consumers += 1;
    if (!socket && !connecting && !reconnectTimer) connect();
    return () => {
        consumers -= 1;
        if (consumers === 0) closeTimer = setTimeout(disconnect, CLOSE_DELAY_MS);
    };
}

function publishOnline(users: Viewer[]) {
    const data = { users };
    latest['presence:online'] = data;
    listeners['presence:online'].forEach((listener) => listener(data));
}

export function subscribe<Type extends EventName>(type: Type, listener: Listener<Type>) {
    listeners[type].add(listener);
    const previous = latest[type];
    if (previous) listener(previous);
    return () => {
        listeners[type].delete(listener);
    };
}

export function onOpen(listener: () => void) {
    openListeners.add(listener);
    if (socket?.readyState === WebSocket.OPEN) listener();
    return () => {
        openListeners.delete(listener);
    };
}

export function send(type: string, data: object = {}) {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, data }));
}
