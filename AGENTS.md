# Consignes de développement — Drops

## 1. Projet et périmètre

Application Next.js réalisée dans le module R505, en BUT MMI 3 à Montbéliard. Elle consomme l’API Drops fournie par l’enseignant. Un drop est un message géolocalisé de catégorie `note`, `photo`, `tip` ou `riddle`.

Ce fichier définit les conventions du front. Les fonctionnalités sont développées progressivement selon les demandes de l’étudiant et les consignes du cours. La présence d’une fonctionnalité dans ce document ne constitue pas une demande de l’implémenter immédiatement.

À ce stade : préparer le socle Next.js et la consommation de l’API REST. La bibliothèque de cartographie et le temps réel seront traités ultérieurement. Ne pas installer de bibliothèque de carte, de client WebSocket ou de bibliothèque Socket.IO avant les consignes correspondantes. Ne pas inventer leur protocole.

L’API existe déjà : ne pas recréer de serveur Express, de base de données, de système de mots de passe ou d’API métier dans ce dépôt. Les Route Handlers Next.js peuvent servir d’intermédiaire avec l’API, notamment pour la session.

## 2. Stack et configuration du projet

| Élément | Configuration | Rôle |
| --- | --- | --- |
| Environnement | Node.js compatible avec la version Next.js du projet | Exécuter les outils et le serveur Next.js |
| Gestionnaire | npm avec `package-lock.json` | Installer les dépendances et lancer les scripts |
| Framework | Next.js `16.4.6` avec App Router | Pages, navigation et rendu serveur |
| Interface | React et React DOM `19.3.0` | Composants et interactions |
| Langage | TypeScript `^5`, mode strict | Types des composants et du contrat API |
| Styles | Tailwind CSS `4.3.3` | Mise en forme responsive |
| HTTP | `fetch` natif | Appels à l’API REST |
| Qualité | ESLint `^9` et vérification TypeScript | Contrôler le code |
| Déploiement | Vercel, relié au dépôt GitHub | Héberger le front Next.js |
| Cache | `cacheComponents: true` et `partialPrefetching: true` | Cache Components et préchargement partiel |
| Compilation React | `reactCompiler: true` | Optimisation des composants par React Compiler |
| Cartographie | À choisir dans la suite du cours | Afficher et manipuler la carte |
| Temps réel | À préciser dans la suite du cours | Recevoir les événements WebSocket |

Les versions ci-dessus correspondent au `package.json` consulté. Le code se trouve dans `src/`, TypeScript est en mode strict et l’alias `@/*` pointe vers `src/*`. Avant chaque modification, relire les fichiers concernés et conserver la configuration en place. Consulter la documentation correspondant à la version installée, notamment `node_modules/next/dist/docs/` si elle est fournie.

Le projet est déjà initialisé avec Next.js, TypeScript et Tailwind. Ne pas relancer le starter ni déplacer `src/app/`. Conserver le bloc de consignes Next.js présent dans ce fichier.

Ne pas ajouter Axios, un gestionnaire d’état global, une bibliothèque de formulaires ou de validation sans besoin concret. Ne pas mettre à jour les dépendances sans lien avec la tâche.

## 3. Organisation du code

Le dossier `src/app/` contient actuellement `page.tsx`, `layout.tsx`, `globals.css` et `favicon.ico`. L’organisation ci-dessous complète cette base au fur et à mesure ; les autres pages et dossiers sont prévus et restent à créer selon les besoins.

| Chemin | Responsabilité |
| --- | --- |
| `AGENTS.md` | Consignes destinées aux agents de développement |
| `src/app/layout.tsx` | Structure globale, métadonnées et langue française |
| `src/app/page.tsx` | Accueil |
| `src/app/globals.css` | Styles globaux et configuration des styles du starter |
| `src/app/drops/page.tsx` | Liste, recherche, filtres et pagination |
| `src/app/drops/[id]/page.tsx` | Détail d’un drop |
| `src/app/drops/nouveau/page.tsx` | Création d’un drop |
| `src/app/connexion/page.tsx` | Connexion |
| `src/app/inscription/page.tsx` | Inscription |
| `src/app/profil/[username]/page.tsx` | Profil public |
| `src/app/statut/page.tsx` | État de santé de l’API |
| `src/app/api/` | Route Handlers nécessaires à la session et aux appels depuis le navigateur |
| `src/components/ui/` | Boutons, champs et éléments réutilisés |
| `src/components/drops/` | Affichage et formulaires des drops |
| `src/components/auth/` | Formulaires et interactions d’authentification |
| `src/lib/api/` | Client HTTP côté serveur et fonctions par domaine : auth, drops, users |
| `src/lib/auth/` | Lecture et gestion serveur du cookie de session |
| `src/types/api.ts` | Types correspondant au contrat Drops |
| `src/hooks/` | Hooks clients lorsqu’une logique doit être réutilisée |
| `public/` | Images et ressources statiques |
| `.env.example` | Variables requises avec valeurs publiques ou exemples |
| `.env.local` | Configuration locale non suivie par Git |
| `README.md` | Installation, lancement et décisions du projet |

Garder une seule organisation dans `src/`. Les futurs composants de carte pourront rejoindre `src/components/map/` et les fonctions de temps réel `src/lib/realtime/`, lorsqu’ils seront demandés.

Les pages assemblent les composants et chargent les données. Les composants d’interface ne contiennent pas les détails des requêtes HTTP. Centraliser l’URL de base, les en-têtes et la lecture des erreurs dans le client API ; regrouper les opérations par domaine plutôt que dupliquer les appels dans chaque page.

## 4. Règles Next.js et React

- Utiliser App Router pour un nouveau projet. Les pages et layouts restent des Server Components par défaut.
- Ajouter `"use client"` aux composants qui utilisent des événements, un état React ou des API du navigateur. Garder cette frontière aussi locale que possible.
- Ne pas accéder à `window`, `document`, `localStorage` ou `navigator` au niveau global d’un module rendu sur le serveur. Une future carte peut nécessiter un chargement côté client selon sa bibliothèque.
- Utiliser les conventions Next.js : `page`, `layout`, `loading`, `error`, `not-found` et `route`, avec l’extension du projet. Utiliser `next/link` pour la navigation interne.
- Les Server Components appellent directement les fonctions serveur de `lib/api/`, sans requête HTTP vers les propres Route Handlers de Next.js. Le navigateur passe par les Route Handlers nécessaires.
- Protéger les modules qui manipulent le token contre un import côté client, par exemple avec `server-only` lorsque disponible.
- Pour démarrer, charger les données personnalisées avec `cache: "no-store"`. Ne pas partager de cache entre utilisateurs. Après une mutation, rafraîchir les données concernées avec le mécanisme adapté au rendu utilisé.
- Ne pas placer toute l’application dans un Client Component pour résoudre un problème local.

### Hooks et bouton de like vus en cours

- Utiliser `useState` pour les valeurs qui changent avec les interactions et mettent à jour l’affichage. Initialiser l’état avec les props reçues lorsque c’est le comportement attendu.
- Utiliser `useEffect` pour synchroniser le composant avec un système extérieur, par exemple un abonnement ou une API du navigateur. Préciser les dépendances et nettoyer les abonnements ou écouteurs.
- Traiter un clic dans son gestionnaire d’événement. Ne pas ajouter un effet pour effectuer une action qui découle seulement de ce clic.
- Calculer directement les valeurs qui peuvent être déduites des props et de l’état, plutôt que créer plusieurs états à synchroniser.
- Le `like-button.tsx` travaillé en cours sert de référence pour un petit composant `"use client"` qui reçoit `initialLiked` et `initialCount` d’un parent serveur. Garder cette séparation pour le bouton du projet.
- Lors du branchement à l’API, utiliser `POST /drops/:id/like` ou `DELETE /drops/:id/like` via une Server Action ou un Route Handler qui lit le cookie. Le token reste côté serveur. Afficher l’attente, gérer l’échec et reprendre les valeurs `liked` et `likesCount` renvoyées par l’API.
- Ne pas confondre un changement visuel local avec un like enregistré. Une mise à jour optimiste éventuelle doit pouvoir être annulée si la requête échoue.

### Rappel du cours : Server, Client et Cache Components

| Type | À retenir |
| --- | --- |
| Server Component | Peut être `async` pour lire l’API et utiliser des secrets côté serveur. Son code n’entre pas dans le bundle navigateur. Il contribue au HTML du premier affichage, éventuellement envoyé progressivement, ce qui facilite l’indexation. Pas de `useState`, de `useEffect` ni de gestionnaire `onClick` dans ce composant. |
| Client Component (`"use client"`) | Permet `useState`, `useEffect`, `onClick` et l’accès aux API du navigateur au bon moment. Son code est envoyé au navigateur et hydraté au premier chargement. Placer la frontière client le plus bas possible dans l’arbre. |
| Fonction ou composant avec `"use cache"` | Réutilise un résultat pour les mêmes paramètres tant que l’entrée reste valide. Pour des données publiques, ce résultat peut être partagé entre utilisateurs. `cacheLife` règle sa durée et `cacheTag` permet de l’identifier pour l’invalidation. Ne jamais appeler directement `cookies()` dans cette portée. |

Le JavaScript des enfants clients et celui du framework peuvent toujours être envoyés : « zéro JavaScript » concerne le code propre du Server Component. Un Client Component peut aussi être prérendu sur le serveur ; `"use client"` n’autorise donc pas à utiliser `window` directement pendant le rendu initial.

Après une écriture réussie dans une Server Action, `updateTag("nom-du-tag")` expire immédiatement l’entrée associée : la prochaine lecture attend des données fraîches. Il faut que la fonction mise en cache utilise le tag correspondant avec `cacheTag`. Ne pas appeler `updateTag` depuis un Client Component ou un Route Handler.

### Choisir entre serveur, client et cache

Le choix serveur/client concerne les responsabilités du composant. Cache Components permet de réutiliser des données ou un rendu côté serveur : ce n’est pas un troisième environnement d’exécution.

| Besoin dans Drops | Choix |
| --- | --- |
| Charger une liste ou un détail depuis l’API et afficher les résultats | Server Component par défaut |
| Lire la session et utiliser le token pour appeler l’API | Code serveur, hors cache partagé |
| Gérer un bouton interactif, un état React ou un effet | Petit Client Component avec `"use client"` |
| Accéder au GPS, à une bibliothèque de carte utilisant le navigateur ou au futur client WebSocket | Client Component ; initialiser les API du navigateur au moment approprié |
| Réutiliser des données publiques peu changeantes, par exemple les catégories | Fonction ou composant serveur avec `"use cache"`, si Cache Components est activé |
| Charger des données fraîches ou propres à la requête | Composant serveur non mis en cache, placé sous une frontière `<Suspense>` adaptée |

Une page peut donc rester côté serveur et contenir un bouton de like côté client. Transmettre uniquement les données nécessaires et sérialisables ; jamais le token. Un formulaire n’impose pas à lui seul de passer toute la page côté client. `"use server"` sert aux Server Functions exposées pour des appels depuis le client, pas à déclarer un Server Component.

### Cache Components dans ce projet

Le projet active déjà `cacheComponents: true`, `partialPrefetching: true` et `reactCompiler: true` dans `next.config.ts`. Conserver ces réglages.

- Avec Cache Components activé, placer `"use cache"` dans une fonction ou un composant serveur asynchrone dont on veut réutiliser le résultat. Choisir une durée avec `cacheLife` et, si une invalidation est nécessaire, un tag avec `cacheTag`.
- Commencer par les catégories publiques, appelées sans token. Garder les listes et détails personnalisés hors du cache partagé, notamment les champs `likedByMe`, `openedByMe` et `isMine`.
- Ne pas lire directement `cookies()`, `headers()` ou les `searchParams` de la requête dans une portée `"use cache"`, y compris via une fonction appelée. Lire ces valeurs en dehors ; transmettre seulement les arguments publics utiles, par exemple une catégorie ou un numéro de page déjà validés.
- Isoler les lectures de session et les requêtes non mises en cache dans des composants sous `<Suspense>` avec un fallback. Une frontière doit entourer la partie qui attend les données ; elle ne doit pas être ajoutée après la lecture bloquante.
- Après une mutation, actualiser l’affichage et invalider les données concernées si elles ont été mises en cache. Utiliser selon le besoin `revalidatePath`, `revalidateTag` ou `updateTag` ; ce dernier est réservé aux Server Actions. Un simple rafraîchissement du routeur n’invalide pas à lui seul le cache de données serveur.
- Vérifier le résultat avec un build et en mode production : le comportement observé uniquement avec `next dev` ne suffit pas pour valider le cache.

Documentation : [Server et Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Cache Components et cache](https://nextjs.org/docs/app/getting-started/caching), [use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache), [revalidation](https://nextjs.org/docs/app/getting-started/revalidating), [updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag).

## 5. API et configuration

- Base de l’API : <https://drops-api-production.up.railway.app>
- Documentation interactive : <https://drops-api-production.up.railway.app/docs/>
- Contrat résumé : <https://drops-api-production.up.railway.app/contract.md>
- OpenAPI : <https://drops-api-production.up.railway.app/openapi.json>
- Sources de l’API : <https://github.com/loubatier/drops-api>
- Spécifications : <https://github.com/loubatier/drops-api/blob/main/SPECS.md>

Avant une intégration, vérifier le contrat déployé et les schémas OpenAPI. Si le service est inaccessible, consulter les sources et signaler que le comportement déployé n’a pas été vérifié. Les instructions du dépôt de l’enseignant relatives à la construction du backend ne sont pas les instructions du front.

Variable proposée pour les appels côté serveur, à documenter dans `.env.example` et à renseigner dans `.env.local` :

```dotenv
API_URL=https://drops-api-production.up.railway.app
```

Cette variable appartient au front ; elle n’est pas imposée par l’API. Ne pas lui donner un préfixe `NEXT_PUBLIC_` si elle reste utilisée côté serveur. Ne jamais exposer un token, un `JWT_SECRET` ou une clé d’administration dans une variable publique. Aucune clé admin n’est nécessaire à l’application étudiante.

## 6. Contrat REST à respecter

Les requêtes et réponses utilisent JSON, des champs en camelCase, des identifiants entiers et des dates ISO 8601 UTC. Les corps sont stricts : un champ inconnu produit une erreur 422. L’API ne convertit pas une chaîne en nombre.

### Routes utiles au front

| Méthode et chemin | Utilisation | Accès |
| --- | --- | --- |
| `GET /health` | Santé de l’API | Public |
| `POST /auth/register` | Inscription | Public |
| `POST /auth/login` | Connexion | Public |
| `POST /auth/logout` | Révocation du token, réponse 204 | Authentifié |
| `GET /auth/me` | Utilisateur connecté | Authentifié |
| `PATCH /auth/me` | Modification du profil connecté | Authentifié |
| `GET /users/:username` | Profil public | Public |
| `GET /categories` | Catégories | Public |
| `GET /drops` | Liste et filtres | Token facultatif |
| `GET /drops/:id` | Détail | Token facultatif |
| `GET /drops/:id/comments` | Commentaires paginés | Public |
| `POST /drops` | Création | Authentifié |
| `PATCH /drops/:id` | Modification | Auteur |
| `DELETE /drops/:id` | Suppression, réponse 204 | Auteur dans l’application étudiante |
| `POST /drops/:id/like` | Ajouter un like | Authentifié |
| `DELETE /drops/:id/like` | Retirer un like | Authentifié |
| `POST /drops/:id/comments` | Ajouter un commentaire | Authentifié |
| `DELETE /comments/:id` | Supprimer un commentaire, réponse 204 | Auteur du commentaire |
| `POST /drops/:id/report` | Signaler, réponse 202 | Authentifié, autre que l’auteur |

Les routes de cette table sont celles de l’API distante. Les éventuelles routes internes Next.js ont leur propre préfixe `/api/`. Ne pas créer d’interface d’administration ni appeler les routes `/admin/*`.

### Corps et données

- Inscription : `{ username, email, password, displayName, bio? }`.
- Connexion : `{ login, password }`, où `login` est le nom d’utilisateur ou l’e-mail. La réponse d’inscription ou de connexion contient `{ user, token, expiresAt }`.
- Profil connecté : modification d’au moins un champ parmi `displayName`, `bio`, `avatarUrl` ; les deux derniers acceptent `null`.
- Création d’un drop : `{ title, content, category, imageUrl?, lat, lng }`. La modification est partielle ; envoyer `lat` et `lng` ensemble lorsqu’on change la position.
- La réponse contient `location: { lat, lng, precision }` : ne pas envoyer cet objet à la place de `lat` et `lng` dans le corps de création.
- Catégories : `note`, `photo`, `tip`, `riddle`. Chaque catégorie renvoyée par `/categories` possède `id` et `label`.
- Un drop contient notamment `id`, `title`, `content`, `category`, `imageUrl`, `location`, `author`, `locked`, `hidden`, `likesCount`, `commentsCount`, `opensCount`, `likedByMe`, `openedByMe`, `isMine`, `createdAt`, `updatedAt`.
- Prévoir `content: string | null`, `imageUrl: string | null` et `location.precision: "exact" | "approx"`, même si le premier bloc renvoie un contenu visible et une position exacte.
- L’auteur public possède `id`, `username`, `displayName`, `avatarUrl`. Ne pas lui inventer un e-mail public.
- Commentaire : corps `{ content }`. Signalement : `{ reason, details? }`, avec `reason` parmi `spam`, `offensive`, `personal_info`, `other`.
- Likes : réponse `{ liked, likesCount }` ; ajout et retrait sont idempotents. Ne pas incrémenter aveuglément le compteur local.
- `isMine` facilite l’affichage des actions ; l’API reste responsable des autorisations.

### Pagination et filtres

`GET /drops` accepte `page`, `pageSize`, `q`, `category`, `author` et `sort` (`recent` ou `popular`). Construire les paramètres avec `URLSearchParams`. Conserver les filtres dans l’URL de la page et revenir à la première page quand ils changent.

Les listes paginées renvoient `{ items, page, pageSize, total, totalPages }`. Valeurs par défaut : `page=1`, `pageSize=20` ; taille maximale : 50. Une page au-delà de la fin renvoie 200 avec `items: []`. Les commentaires utilisent aussi cette pagination.

### Validation des formulaires

- `username` : 3 à 20 caractères, lettres minuscules, chiffres et `_` ; `admin` et `me` réservés.
- `password` : 8 à 72 caractères ; `displayName` : 1 à 40 ; `bio` : 280 au maximum.
- Titre : 3 à 80 caractères ; contenu du drop : 1 à 1000 ; commentaire : 1 à 500.
- `imageUrl` et `avatarUrl` : URL HTTPS, 500 caractères maximum, ou `null`. Une catégorie `photo` exige une image. L’API attend une URL, pas un fichier téléversé.
- Convertir les coordonnées saisies en nombres finis ; latitude entre −90 et 90, longitude entre −180 et 180.
- La zone autorisée dépend du serveur. Configuration par défaut : 3 km autour de `47.495472, 6.805279`. Ne pas considérer cette valeur comme une configuration déployée vérifiée.
- Toutes les erreurs de coordonnées sont associées à `fields.location`.
- La validation du front aide l’utilisateur ; elle ne remplace pas celle du serveur.

## 7. Session et erreurs HTTP

### Lien avec les cours Node.js

Les cours ont abordé l’inscription avec bcrypt, les sessions Express et les cookies, les contrôles de connexion et de rôle, puis Google OAuth et les JWT avec refresh token. S’appuyer sur ces notions pour comprendre les responsabilités, en respectant le contrat Drops.

| Notion travaillée | Application dans Drops |
| --- | --- |
| Hacher et vérifier les mots de passe avec bcrypt | Responsabilité de l’API du professeur ; Next.js transmet les formulaires aux routes `/auth/register` et `/auth/login` |
| Conserver une connexion avec une session et un cookie | Next.js conserve le token fourni par l’API dans son cookie `httpOnly`, sans reprendre `express-session` |
| Protéger les actions et contrôler les droits | Next.js adapte l’interface ; l’API vérifie le token et les autorisations sur chaque action |
| JWT, expiration et déconnexion | Transmettre le Bearer, gérer les 401 et révoquer le token avec `/auth/logout` ; ne pas ajouter de refresh token ou de connexion Google absents du contrat |

Ne pas recopier le serveur Express des exercices, créer une nouvelle base de comptes ou installer bcrypt dans ce front. Les données de session et les réponses personnalisées restent hors du cache partagé.

### Session Next.js

L’API reçoit `Authorization: Bearer <token>` et ne pose aucun cookie. Conserver le token dans un cookie de l’application Next.js : `httpOnly`, `sameSite: "lax"`, `path: "/"`, `secure` en production, expiration alignée sur `expiresAt`. Ne pas le placer dans `localStorage`, le HTML, les props clientes ou les logs.

Lire le cookie côté serveur et transmettre le Bearer à l’API. Utiliser l’API cookies compatible avec la version installée de Next.js ; sur les versions récentes, `cookies()` est asynchrone. Créer et supprimer le cookie depuis un Route Handler ou une Server Action, jamais pendant le rendu d’un Server Component. Protéger les mutations authentifiées contre les requêtes intersites, notamment en vérifiant leur origine dans les Route Handlers.

Un token invalide, expiré ou révoqué provoque un 401 même sur une route publique. Distinguer `invalid_credentials` lors de la connexion d’une session devenue invalide. Pour une session expirée, proposer la reconnexion et organiser la suppression du cookie dans un contexte autorisé. Ne pas inventer de route de refresh token. À la déconnexion, appeler `/auth/logout` pour révoquer le token et supprimer le cookie local.

### Erreurs HTTP

Format d’erreur :

```ts
type ApiErrorResponse = {
  error: {
    status: number;
    code: string;
    message: string;
    fields: Record<string, string[]>;
    requestId: string;
    simulated: boolean;
  };
};
```

Vérifier `response.ok` : `fetch` ne rejette pas automatiquement les statuts 4xx et 5xx. Ne pas appeler `response.json()` sur une réponse 204. Distinguer les erreurs de l’API des erreurs réseau et des réponses inattendues. Ne pas remplacer une erreur réelle par une fausse liste vide.

- 401 : connexion nécessaire, identifiants incorrects ou session invalide selon le code.
- 403 : action interdite, avec message explicite ; ne pas déclencher une boucle de reconnexion.
- 404 : ressource introuvable, y compris un drop masqué pour un autre utilisateur.
- 409 et 422 : afficher les messages de `fields` sous les champs concernés et garder la saisie.
- 429 : respecter `Retry-After` ; éviter les relances immédiates en boucle.
- 500, 503 ou erreur réseau : afficher une erreur compréhensible et une action de nouvelle tentative adaptée. Ne pas répéter automatiquement une écriture dont le résultat est incertain.

## 8. Interface et géolocalisation future

Textes visibles et explications en français ; identifiants de code en anglais. Produire un code simple et compréhensible pour un étudiant. Commenter les choix utiles, sans commenter chaque ligne.

Prévoir les états chargement, succès, vide et erreur. Pendant une soumission, afficher l’attente et empêcher les doubles envois. Utiliser du HTML sémantique, des labels explicites, une navigation au clavier, un focus visible et des messages d’erreur accessibles. Adapter l’interface au mobile et au bureau.

Lors de l’étape cartographie, demander la géolocalisation à la suite d’une action explicite, gérer refus et indisponibilité, et utiliser un contexte sécurisé compatible avec le navigateur. Ne pas diffuser ni enregistrer de suivi de position utilisateur par défaut. Le contrat prévoit des positions de drops ; il ne prévoit pas de diffuser la position des étudiants sur le WebSocket.

## 9. Vérification et méthode de travail

1. Lire le code existant et identifier la demande précise avant de modifier des fichiers.
2. Développer seulement l’étape demandée, sans générer toute l’application à partir de ce document.
3. Garder les modifications ciblées et préserver le travail existant. Signaler les hypothèses et les points bloquants concrets.
4. Lancer les contrôles adaptés présents dans le dépôt : `npm run lint`, `npx tsc --noEmit` et `npm run build`. Les scripts `dev`, `build`, `start` et `lint` sont présents dans `package.json` ; ne pas inventer une commande `next lint`.
5. Vérifier les parcours modifiés et résumer les contrôles effectués. Si un contrôle ne peut pas être exécuté, le dire sans le présenter comme réussi.

Outils pédagogiques de l’API, si activés sur l’instance : `?delay=2000` pour le chargement, `?fail=500` pour une erreur, `?fail=422` pour les erreurs de formulaire, `?fail=429` pour la limite et `POST /auth/login?ttl=10` pour une session courte. Ne pas les laisser actifs dans les appels ordinaires.

Compte de démonstration documenté : `demo` / `drops2026`. Un deuxième compte de démonstration permet de vérifier un refus 403. L’instance étant partagée avec la classe, ne pas lancer de reset, de suppression massive ni de scénario de signalements qui masque les drops des autres. Tester les écritures sur des données dédiées et nettoyer uniquement les données créées pour le test.

Ne pas créer de commit, pousser de modification ou déployer sans demande correspondante. À la fin d’une tâche, expliquer brièvement ce qui a changé, comment cela a été vérifié et ce qui reste à faire.

## 10. Déploiement sur Vercel

Le front Next.js sera déployé sur Vercel depuis le dépôt GitHub personnel. L’API Drops reste hébergée sur Railway par l’enseignant.

- Utiliser le preset Next.js et les réglages de build détectés par Vercel, sauf besoin identifié. Vérifier le répertoire racine si le projet est dans un sous-dossier. Conserver le rendu serveur et les Route Handlers nécessaires à la session ; ne pas activer `output: "export"`.
- Aligner la version Node.js locale, celle déclarée par le projet et une version prise en charge par Vercel et Next.js.
- Configurer `API_URL=https://drops-api-production.up.railway.app` dans les variables Vercel pour Preview et Production. `.env.local` reste réservé au développement local et ne doit pas être commité.
- Redéployer après une modification des variables d’environnement. Documenter les variables nécessaires dans `.env.example` et le README.
- Vérifier la branche de production et les déploiements automatiques configurés. Un push sur une branche connectée peut déclencher un déploiement : ne pas pousser ou déployer sans demande correspondante.
- Après déploiement, vérifier les pages, les appels API, le cache et, quand elle sera implémentée, la session avec cookie sécurisé sur HTTPS.
- Les previews peuvent utiliser la même API partagée que la production. Tester les écritures uniquement sur des données dédiées.

Documentation : [Next.js sur Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [variables d’environnement](https://vercel.com/docs/environment-variables), [intégration Git](https://vercel.com/docs/git).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->