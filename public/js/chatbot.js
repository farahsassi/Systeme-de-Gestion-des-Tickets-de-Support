// Variables globales pour le chatbot
let conversationContext = {
  collectingInfo: false,
  ticketData: {
    title: '',
    description: '',
    category: '',
    priority: 'Moyenne'
  },
  currentStep: ''
};

// Initialisation du chatbot
document.addEventListener('DOMContentLoaded', function() {
  // Scroll vers le bas du chat
  scrollToBottom();
});

function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Afficher le message de l'utilisateur
  addMessage(message, 'user');
  input.value = '';
  
  // Envoyer au serveur
  fetch('/chatbot/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message,
      context: conversationContext 
    }),
  })
  .then(response => response.json())
  .then(data => {
    // Afficher la réponse du bot
    addMessage(data.reply, 'bot');
    
    // Mettre à jour le contexte si nécessaire
    if (data.context) {
      conversationContext = data.context;
    }
    
    // Si un ticket a été créé, rediriger ou afficher un message
    if (data.ticketCreated) {
      setTimeout(() => {
        addMessage(`Ticket créé avec succès ! Numéro: ${data.ticketId}`, 'bot');
        // Optionnel: rediriger vers la page du ticket
        // window.location.href = `/tickets/${data.ticketId}`;
      }, 1000);
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
    addMessage('Désolé, une erreur est survenue. Veuillez réessayer.', 'bot');
  });
}

function addMessage(message, sender) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
  
  const time = new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const icon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
  const iconColor = sender === 'user' ? 'text-primary' : 'text-primary';
  
  messageDiv.innerHTML = `
    <div class="message-content">
      <i class="${icon} ${iconColor} me-2"></i>
      ${message}
      <div class="message-time">${time}</div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

function scrollToBottom() {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fonction pour créer un ticket via le chatbot
function createTicketFromChat(ticketData) {
  return fetch('/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData)
  })
  .then(response => response.json());
}

// Fonction pour analyser le message et extraire les informations
function analyzeMessage(message) {
  const lowerMessage = message.toLowerCase();
  
  // Détecter la catégorie
  if (lowerMessage.includes('technique') || lowerMessage.includes('bug') || lowerMessage.includes('erreur')) {
    return { category: 'Technique' };
  } else if (lowerMessage.includes('billing') || lowerMessage.includes('facturation') || lowerMessage.includes('paiement')) {
    return { category: 'Facturation' };
  } else if (lowerMessage.includes('compte') || lowerMessage.includes('connexion') || lowerMessage.includes('mot de passe')) {
    return { category: 'Compte' };
  } else {
    return { category: 'Général' };
  }
}

// Fonction pour détecter la priorité
function detectPriority(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('urgent') || lowerMessage.includes('critique') || lowerMessage.includes('bloqué')) {
    return 'Élevée';
  } else if (lowerMessage.includes('important') || lowerMessage.includes('problème')) {
    return 'Moyenne';
  } else {
    return 'Faible';
  }
}