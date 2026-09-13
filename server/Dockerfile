# Image de production pour le backend Express
FROM node:24-alpine

# Dossier de travail
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install --omit=dev

# Copie du code du serveur
COPY . .

# Port utilisé par Express
EXPOSE 4000

# Démarrage en production
CMD ["npm", "start"]