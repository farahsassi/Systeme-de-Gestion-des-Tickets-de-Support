const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

async function createTestAgents() {
  try {
    await connectDB();
    console.log('🔗 Connexion à la base de données établie');

    // Vérifier si les agents existent déjà
    const existingAgents = await User.find({ role: 'agent' });
    
    if (existingAgents.length > 0) {
      console.log('✅ Agents existants trouvés:');
      existingAgents.forEach(agent => {
        console.log(`- ${agent.firstName} ${agent.lastName} (${agent.email})`);
      });
      process.exit(0);
    }

    // Créer des agents de test
    const agents = [
      {
        firstName: 'Agent',
        lastName: 'Technique',
        email: 'agent.tech@example.com',
        phoneNumber: '0123456790',
        password: 'password123',
        role: 'agent'
      },
      {
        firstName: 'Agent',
        lastName: 'Support',
        email: 'agent.support@example.com',
        phoneNumber: '0123456791',
        password: 'password123',
        role: 'agent'
      },
      {
        firstName: 'Agent',
        lastName: 'Facturation',
        email: 'agent.billing@example.com',
        phoneNumber: '0123456792',
        password: 'password123',
        role: 'agent'
      }
    ];

    for (const agentData of agents) {
      const agent = new User(agentData);
      await agent.save();
      console.log(`✅ Agent créé: ${agent.firstName} ${agent.lastName}`);
    }

    console.log('\n🎉 Tous les agents de test ont été créés avec succès !');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur lors de la création des agents:', error);
    process.exit(1);
  }
}

createTestAgents(); 