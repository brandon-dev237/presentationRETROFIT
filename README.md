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

## Déploiement en production

Le déploiement utilise [`docker-compose.prod.yml`](docker-compose.prod.yml), qui construit des images figées (pas de hot-reload, pas de volumes montés) :

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
