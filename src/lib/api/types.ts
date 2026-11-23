import type {components, paths} from "./schema"

type S = components["schemas"]

export type Drop = S["Drop"]
export type DropPage = S["DropPage"]
export type Comment = S["Comment"]
export type CommentPage = S["CommentPage"]
export type Category = S["Category"]
export type Health = S["Health"]
export type AuthResponse = S["AuthResponse"]
export type ApiErrorResponse = S["ErrorResponse"]
export type RegisterRequest = paths["/auth/register"]["post"]["requestBody"]["content"]["application/json"]
