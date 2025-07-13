// Script de test pour le chatbot
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testChatbot() {
  console.log('🤖 Test du Chatbot Assistant Virtuel\n');
  
  try {
    // Test 1: Statut du chatbot
    console.log('1. Test du statut du chatbot...');
    const statusResponse = await axios.get(`${BASE_URL}/chatbot/status`);
    console.log('✅ Statut:', statusResponse.data);
    
    // Test 2: Message de salutation
    console.log('\n2. Test d\'un message de salutation...');
    const greetingResponse = await axios.post(`${BASE_URL}/chatbot/message`, {
      message: 'Bonjour, comment allez-vous ?',
      context: {}
    });
    console.log('✅ Réponse:', greetingResponse.data.reply);
    
    // Test 3: Création d'un ticket technique
    console.log('\n3. Test de création d\'un ticket technique...');
    const ticketResponse = await axios.post(`${BASE_URL}/chatbot/message`, {
      message: 'J\'ai un problème technique urgent avec l\'application, elle plante constamment',
      context: { collectingInfo: true }
    });
    console.log('✅ Réponse:', ticketResponse.data.reply);
    
    if (ticketResponse.data.ticketCreated) {
      console.log('🎉 Ticket créé avec succès !');
      console.log('📋 ID du ticket:', ticketResponse.data.ticketId);
    }
    
    // Test 4: Création d'un ticket de facturation
    console.log('\n4. Test de création d\'un ticket de facturation...');
    const billingResponse = await axios.post(`${BASE_URL}/chatbot/message`, {
      message: 'Je ne comprends pas ma facture, pouvez-vous m\'aider ?',
      context: { collectingInfo: true }
    });
    console.log('✅ Réponse:', billingResponse.data.reply);
    
    console.log('\n🎉 Tous les tests sont terminés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
  }
}

// Lancer les tests si le script est exécuté directement
if (require.main === module) {
  testChatbot();
}

module.exports = { testChatbot }; 