# Image de développement pour le backend Express.
# Le code source est monté en volume par docker-compose (voir docker-compose.yml),
# donc cette image installe seulement les dépendances ; nodemon recharge le serveur
# automatiquement quand un fichier change, comme en local.
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "server"]
