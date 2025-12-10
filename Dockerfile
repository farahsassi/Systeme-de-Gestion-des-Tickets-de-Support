# Étape 1 : Utiliser une image Node officielle
FROM node:18

# Étape 2 : Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copier les fichiers de dépendances
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier le reste de l'application
COPY . .

# Étape 6 : Exposer le port sur lequel tourne ton app
EXPOSE 3000

# Étape 7 : Démarrer ton app
CMD ["npm", "start"]
