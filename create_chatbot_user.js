const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

async function createChatbotUser() {
  try {
    await connectDB();
    console.log('🔗 Connexion à la base de données établie');

    // Vérifier si l'utilisateur Chatbot existe déjà
    const existingChatbot = await User.findOne({ email: 'chatbot@system.com' });
    
    if (existingChatbot) {
      console.log('✅ Utilisateur Chatbot existe déjà');
      console.log(`ID du Chatbot: ${existingChatbot._id}`);
      process.exit(0);
    }

    // Créer l'utilisateur Chatbot
    const chatbotUser = new User({
      firstName: 'Assistant',
      lastName: 'Virtuel',
      email: 'chatbot@system.com',
      phoneNumber: '0000000000',
      password: 'chatbot_password_secure',
      role: 'user'
    });
    
    await chatbotUser.save();
    console.log('✅ Utilisateur Chatbot créé avec succès !');
    console.log(`ID du Chatbot: ${chatbotUser._id}`);
    console.log('Email: chatbot@system.com');

    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur Chatbot:', error);
    process.exit(1);
  }
}

createChatbotUser(); 