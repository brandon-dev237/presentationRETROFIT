# Image de développement pour le frontend Vite/React.
# Le code source est monté en volume par docker-compose (voir docker-compose.yml),
# donc cette image installe seulement les dépendances ; Vite recharge le navigateur
# automatiquement quand un fichier change, comme en local.
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
