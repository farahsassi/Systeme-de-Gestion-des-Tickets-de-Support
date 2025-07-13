# 🤖 Chatbot Assistant Virtuel - Système de Gestion des Tickets

## 📋 Vue d'ensemble

Le chatbot intégré permet aux utilisateurs de créer des tickets de support de manière interactive et intuitive. Il analyse automatiquement les messages des utilisateurs, comprend leurs besoins, et crée des tickets avec assignation automatique aux agents.

## ✨ Fonctionnalités

### 🎯 Création Automatique de Tickets
- **Analyse intelligente** : Le chatbot comprend le problème décrit par l'utilisateur
- **Catégorisation automatique** : Détecte la catégorie (Technique, Facturation, Compte, etc.)
- **Priorisation intelligente** : Détermine la priorité selon les mots-clés utilisés
- **Génération de titre** : Crée un titre descriptif basé sur le message

### 👥 Assignation Automatique
- **Répartition équitable** : Assigne les tickets selon la charge de travail des agents
- **Stratégie intelligente** : L'agent le moins chargé reçoit le nouveau ticket
- **Gestion des priorités** : Prend en compte les tickets ouverts et en cours

### 💬 Interface Conversationnelle
- **Interface moderne** : Design responsive et attrayant
- **Messages en temps réel** : Affichage instantané des messages
- **Historique de conversation** : Conservation du contexte
- **Animations fluides** : Expérience utilisateur optimisée

## 🚀 Comment utiliser le chatbot

### 1. Accès au chatbot
Le chatbot est disponible sur la page `/tickets` (liste des tickets).

### 2. Démarrage de la conversation
- Cliquez dans la zone de texte du chatbot
- Tapez votre message (ex: "Bonjour, j'ai un problème technique")
- Appuyez sur Entrée ou cliquez sur le bouton d'envoi

### 3. Création d'un ticket
Le chatbot va :
1. Analyser votre message
2. Détecter la catégorie et la priorité
3. Créer automatiquement un ticket
4. L'assigner à un agent disponible
5. Vous confirmer la création avec les détails

## 🔧 Configuration Technique

### Structure des fichiers
```
├── public/js/chatbot.js          # Logique frontend du chatbot
├── controllers/chatbotController.js  # Contrôleur API
├── services/chatbotService.js     # Service de traitement
├── routes/chatbot.js             # Routes API
└── views/tickets/list.ejs        # Interface utilisateur
```

### API Endpoints
- `POST /chatbot/message` : Traite un message utilisateur
- `GET /chatbot/status` : Statut du service chatbot

### Modèles utilisés
- **Ticket** : Stockage des tickets créés
- **User** : Gestion des agents pour l'assignation

## 🎨 Personnalisation

### Styles CSS
Les styles du chatbot sont dans `public/css/style.css` :
- `.chat-messages` : Zone de messages
- `.bot-message` / `.user-message` : Styles des messages
- `.chatbot-header` : En-tête du chatbot

### Logique d'assignation
Modifiable dans `services/chatbotService.js` :
- `assignTicketAutomatically()` : Stratégie d'assignation
- `analyzeMessage()` : Analyse des messages
- `detectPriority()` : Détection de priorité

## 📊 Catégories et Priorités

### Catégories détectées
- **Technique** : bug, erreur, plantage, crash
- **Facturation** : paiement, facture, tarif, prix
- **Compte** : connexion, mot de passe, inscription
- **Commande** : livraison, expédition, retour
- **Général** : par défaut

### Priorités détectées
- **Élevée** : urgent, critique, bloqué, impossible
- **Moyenne** : par défaut
- **Faible** : petit, simple, question, info

## 🔍 Dépannage

### Problèmes courants
1. **Chatbot ne répond pas** : Vérifiez la console du navigateur
2. **Erreur de création de ticket** : Vérifiez la base de données
3. **Pas d'agents disponibles** : Créez des utilisateurs avec le rôle "agent"

### Logs de débogage
Les erreurs sont loggées dans la console du serveur et du navigateur.

## 🚀 Améliorations futures

- [ ] Intégration avec des services NLP avancés (OpenAI, Dialogflow)
- [ ] Support multilingue
- [ ] Historique des conversations
- [ ] Notifications push en temps réel
- [ ] Analyse de sentiment
- [ ] Suggestions de solutions automatiques

## 📞 Support

Pour toute question ou problème avec le chatbot, contactez l'équipe de développement. 