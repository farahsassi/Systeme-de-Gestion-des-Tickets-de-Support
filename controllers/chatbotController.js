const chatbotService = require('../services/chatbotService');

exports.handleMessage = async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        reply: "Veuillez saisir un message.",
        error: "Message vide"
      });
    }
    
    // Ajouter l'ID de l'utilisateur au contexte si disponible
    if (req.user) {
      context.userId = req.user._id;
    }
    
    const response = await chatbotService.processMessage(message, context);
    
    res.json(response);
    
  } catch (error) {
    console.error('Erreur dans le contrôleur chatbot:', error);
    res.status(500).json({ 
      reply: "Désolé, une erreur est survenue. Veuillez réessayer.",
      error: "Erreur serveur"
    });
  }
};

exports.getStatus = (req, res) => {
  res.json({ 
    status: "active",
    features: [
      "Création automatique de tickets",
      "Assignation intelligente des agents",
      "Analyse automatique des priorités",
      "Catégorisation automatique"
    ]
  });
};
