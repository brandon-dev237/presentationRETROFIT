# RetroFit

Boutique en ligne de vêtements vintage — frontend React/Vite + backend Express/MongoDB.

- [`retrofit/`](retrofit) — frontend (React, Vite, Tailwind)
- [`server/`](server) — backend (Express, MongoDB, Cloudinary, Stripe)

## Prérequis

- [Docker](https://www.docker.com/) + Docker Compose
- Un compte MongoDB Atlas, Cloudinary et Stripe (les identifiants vont dans les fichiers `.env`)

## Configuration

Copier les fichiers d'exemple et remplir les valeurs réelles :

```bash
cp server/.env.example server/.env
cp retrofit/.env.example retrofit/.env
```

Voir [server/.env.example](server/.env.example) et [retrofit/.env.example](retrofit/.env.example) pour la liste des variables et leur rôle.

## Développement local

```bash
docker compose up
```

- Frontend : http://localhost:5173 (Vite avec hot-reload)
- Backend : http://localhost:4000 (nodemon, redémarre automatiquement)

Le code source est monté en volume : les modifications sont reprises à chaud, comme en local sans Docker.

## Déploiement sur Railway

C'est la méthode utilisée pour ce projet. Railway ne lit pas directement `docker-compose.prod.yml` pour un monorepo — on crée deux services distincts dans le même projet Railway, chacun pointant vers un sous-dossier du repo GitHub.

### 1. Service backend

1. Nouveau service → **GitHub Repo** → sélectionner ce repo
2. Settings → Source → **Root Directory** : `server`
3. Railway détecte automatiquement `server/Dockerfile` (déjà en mode production)
4. Settings → Variables : renseigner toutes les variables de [server/.env.example](server/.env.example), avec `NODE_ENV=production`
5. Settings → Networking → **Generate Domain** → noter l'URL générée (ex. `retrofit-api.up.railway.app`)

### 2. Service frontend

1. Nouveau service → même repo GitHub
2. Root Directory : `retrofit`
3. Comme `retrofit/` contient deux Dockerfiles, ajouter la variable `RAILWAY_DOCKERFILE_PATH=Dockerfile.prod` pour que Railway utilise la version production (build Vite + nginx) plutôt que la version dev
4. Variables : `VITE_BACKEND_URL` = l'URL du backend générée à l'étape précédente, `VITE_CURRENCY=$` — Railway les transmet automatiquement au build (les `ARG` sont déjà déclarés dans [retrofit/Dockerfile.prod](retrofit/Dockerfile.prod))
5. Generate Domain → noter l'URL générée (ex. `retrofit-app.up.railway.app`)

### 3. Boucler la configuration

Retourner sur le service backend et mettre à jour `FRONTEND_URL` avec l'URL du frontend obtenue à l'étape 2, puis redéployer.

Mettre à jour l'URL du webhook Stripe pour qu'elle pointe vers `https://<domaine-backend>/api/order/stripe/webhook`.

### 4. Domaine personnalisé (optionnel)

Sur chaque service : Settings → Public Networking → **+ Custom Domain**. L'option n'apparaît qu'une fois le service effectivement déployé (pas seulement "changements en attente").

- **Domaine acheté directement via Railway** (railway.com/domains) : le DNS est déjà géré par Railway, l'attachement est automatique, pas de CNAME/TXT à saisir.
- **Domaine acheté chez un registrar externe** (Namecheap, OVH, etc.) : Railway fournit un enregistrement **CNAME et un TXT** à ajouter chez le registrar — les deux sont obligatoires (sans le TXT, le domaine renvoie une 404 même si le CNAME est propagé).

Une fois les domaines personnalisés vérifiés, mettre à jour `FRONTEND_URL` et `VITE_BACKEND_URL` en conséquence (et redéployer le frontend, puisque cette variable est figée au build).

⚠️ **Piège du port** : quand Railway ajoute un domaine, il demande de choisir un **port cible**. Railway injecte automatiquement sa propre variable `PORT` dans le conteneur (généralement `8080`), qui prend le dessus sur le `4000` par défaut du code (`process.env.PORT || 4000`). Le port réel sur lequel écoute l'app est visible dans les **logs de déploiement** (`Server running on port XXXX`) — c'est ce port-là qu'il faut choisir pour le domaine, pas celui codé en dur dans `server.js` ou `EXPOSE`. Un mauvais port cible donne une erreur **"Application failed to respond"**.

### 5. Redéploiements

Railway redéploie automatiquement à chaque `git push` sur `main`. Un changement de variable d'environnement suffit à redéclencher un déploiement du service concerné.

## Déploiement alternatif avec Docker Compose (VPS)

Si un jour l'hébergement passe sur un VPS plutôt que Railway, [`docker-compose.prod.yml`](docker-compose.prod.yml) construit des images figées (pas de hot-reload, pas de volumes montés) :

- **backend** : image Node buildée avec `npm install --omit=dev`, démarrée avec `npm start`
- **frontend** : build multi-stage — `vite build` puis les fichiers statiques sont servis par nginx ([retrofit/Dockerfile.prod](retrofit/Dockerfile.prod), [retrofit/nginx.conf](retrofit/nginx.conf))

### 1. Variables d'environnement backend

Remplir [server/.env](server/.env.example) avec les valeurs de production (base de données, Stripe, Cloudinary, `FRONTEND_URL` pointant vers l'URL publique du frontend, `NODE_ENV=production`).

### 2. Variables d'environnement frontend (au moment du build)

Contrairement au backend, les variables `VITE_*` sont intégrées dans le code au moment du **build**, pas au démarrage du conteneur. Elles doivent donc être définies dans un fichier `.env` **à la racine du projet** (à côté de `docker-compose.prod.yml`), pas dans `retrofit/.env` :

```bash
# .env (à la racine)
VITE_BACKEND_URL=https://api.mondomaine.com
VITE_CURRENCY=$
```

`VITE_BACKEND_URL` doit être l'URL publique du backend (le navigateur de l'utilisateur final y accédera directement), pas un nom de service Docker interne.

### 3. Build et démarrage

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

- Frontend servi sur le port `80`
- Backend exposé sur le port `4000`

Si les variables `VITE_*` changent, il faut reconstruire l'image frontend (`--build`) — elles ne sont pas relues au redémarrage.

### 4. Ce qui reste à la charge de l'hébergeur

- **HTTPS / reverse proxy** : ce compose n'inclut pas de certificat TLS. En production, mettre nginx/Traefik/Caddy (ou le load balancer du fournisseur cloud) devant les deux services.
- **Nom de domaine** : faire pointer le domaine du frontend et celui de l'API vers les ports exposés.
- **Webhook Stripe** : configurer l'URL du webhook côté Stripe pour qu'elle pointe vers `https://api.mondomaine.com/api/order/stripe/webhook`.

## Arrêter les conteneurs

```bash
docker compose down                              # développement
docker compose -f docker-compose.prod.yml down   # production
```
