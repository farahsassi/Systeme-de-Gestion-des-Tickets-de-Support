const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Variable pour stocker l'ID de l'utilisateur Chatbot
let chatbotUserId = null;

// Fonction pour obtenir l'ID de l'utilisateur Chatbot
const getChatbotUserId = async () => {
  if (chatbotUserId) {
    return chatbotUserId;
  }
  
  try {
    const chatbotUser = await User.findOne({ email: 'chatbot@system.com' });
    if (chatbotUser) {
      chatbotUserId = chatbotUser._id;
      return chatbotUserId;
    } else {
      console.error('Utilisateur Chatbot non trouvé dans la base de données');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur Chatbot:', error);
    return null;
  }
};

const processMessage = async (message, context = {}) => {
  const lowerMessage = message.toLowerCase();
  
  // Si c'est le début de la conversation
  if (!context.collectingInfo) {
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('hello') || lowerMessage.includes('salut')) {
      return {
        reply: "Bonjour ! Je suis votre assistant virtuel. Je peux vous aider à créer un ticket de support. Décrivez-moi votre problème et je créerai un ticket pour vous.",
        context: { ...context, collectingInfo: true, currentStep: 'waiting_for_description' }
      };
    }
    
    // Si l'utilisateur décrit directement son problème
    if (lowerMessage.length > 10) {
      return await analyzeAndCreateTicket(message, context);
    }
  }
  
  // Si on collecte des informations
  if (context.collectingInfo) {
    return await analyzeAndCreateTicket(message, context);
  }
  
  // Réponse par défaut
  return {
    reply: "Bonjour ! Je suis votre assistant virtuel. Décrivez-moi votre problème et je créerai un ticket de support pour vous.",
    context: { ...context, collectingInfo: true, currentStep: 'waiting_for_description' }
  };
};

const analyzeAndCreateTicket = async (message, context) => {
  try {
    // Analyser le message pour extraire les informations
    const analysis = analyzeMessage(message);
    
    // Obtenir l'ID de l'utilisateur Chatbot
    const chatbotId = await getChatbotUserId();
    if (!chatbotId) {
      throw new Error('Impossible de récupérer l\'utilisateur Chatbot');
    }
    
    // Créer le ticket directement dans la base de données
    const ticketData = {
      title: generateTitle(message),
      description: message,
      category: analysis.category,
      priority: analysis.priority,
      status: 'Ouvert',
      createdBy: chatbotId, // Utiliser l'ID de l'utilisateur Chatbot
      source: 'chatbot' // Indiquer que le ticket vient du chatbot
    };
    
    // Créer le ticket dans la base de données
    const ticket = new Ticket(ticketData);
    await ticket.save();
    
    // Assigner automatiquement le ticket
    const assignedAgent = await assignTicketAutomatically(ticket);
    if (assignedAgent) {
      ticket.assignedTo = assignedAgent._id;
      await ticket.save();
    }
    
    return {
      reply: `Parfait ! J'ai créé un ticket pour vous. Voici les détails :
      
📋 **Titre** : ${ticket.title}
🏷️ **Catégorie** : ${ticket.category}
⚡ **Priorité** : ${ticket.priority}
👤 **Assigné à** : ${assignedAgent ? `${assignedAgent.firstName} ${assignedAgent.lastName}` : 'En cours d\'assignation'}

Votre ticket a été créé avec succès et sera traité par notre équipe. Vous recevrez des mises à jour par email.`,
      context: { ...context, collectingInfo: false, currentStep: 'ticket_created' },
      ticketCreated: true,
      ticketId: ticket._id
    };
    
  } catch (error) {
    console.error('Erreur lors de la création du ticket:', error);
    return {
      reply: "Désolé, une erreur est survenue lors de la création du ticket. Veuillez réessayer ou contacter directement notre équipe support.",
      context: { ...context, collectingInfo: false }
    };
  }
};

const analyzeMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Détecter la catégorie
  let category = 'Général';
  if (lowerMessage.includes('technique') || lowerMessage.includes('bug') || lowerMessage.includes('erreur') || 
      lowerMessage.includes('plantage') || lowerMessage.includes('crash') || lowerMessage.includes('fonctionne pas')) {
    category = 'Technique';
  } else if (lowerMessage.includes('facturation') || lowerMessage.includes('paiement') || lowerMessage.includes('billing') || 
             lowerMessage.includes('facture') || lowerMessage.includes('tarif') || lowerMessage.includes('prix')) {
    category = 'Facturation';
  } else if (lowerMessage.includes('compte') || lowerMessage.includes('connexion') || lowerMessage.includes('mot de passe') || 
             lowerMessage.includes('login') || lowerMessage.includes('inscription') || lowerMessage.includes('profil')) {
    category = 'Compte';
  } else if (lowerMessage.includes('commande') || lowerMessage.includes('livraison') || lowerMessage.includes('expédition') || 
             lowerMessage.includes('retour') || lowerMessage.includes('remboursement')) {
    category = 'Commande';
  }
  
  // Détecter la priorité
  let priority = 'Moyenne';
  if (lowerMessage.includes('urgent') || lowerMessage.includes('critique') || lowerMessage.includes('bloqué') || 
      lowerMessage.includes('impossible') || lowerMessage.includes('grave') || lowerMessage.includes('important')) {
    priority = 'Élevée';
  } else if (lowerMessage.includes('petit') || lowerMessage.includes('simple') || lowerMessage.includes('question') || 
             lowerMessage.includes('info') || lowerMessage.includes('renseignement')) {
    priority = 'Faible';
  }
  
  return { category, priority };
};

const generateTitle = (message) => {
  // Extraire les premiers mots du message pour créer un titre
  const words = message.split(' ').slice(0, 5);
  return words.join(' ') + (message.length > 50 ? '...' : '');
};

const assignTicketAutomatically = async (ticket) => {
  try {
    // Récupérer tous les agents disponibles
    const agents = await User.find({ role: 'agent' });
    
    if (agents.length === 0) {
      return null;
    }
    
    // Stratégie d'assignation : par charge de travail
    const agentsWithWorkload = await Promise.all(
      agents.map(async (agent) => {
        const openTickets = await Ticket.countDocuments({
          assignedTo: agent._id,
          status: { $in: ['Ouvert', 'En cours'] }
        });
        
        return {
          agent,
          workload: openTickets
        };
      })
    );
    
    // Trier par charge de travail (le moins chargé en premier)
    agentsWithWorkload.sort((a, b) => a.workload - b.workload);
    
    // Retourner l'agent le moins chargé
    return agentsWithWorkload[0].agent;
    
  } catch (error) {
    console.error('Erreur lors de l\'assignation automatique:', error);
    return null;
  }
};

module.exports = { processMessage };
