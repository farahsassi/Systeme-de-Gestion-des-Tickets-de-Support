const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

async function createTestData() {
  try {
    await connectDB();
    console.log('🔗 Connexion à la base de données établie');

    // Supprimer les données existantes
    await User.deleteMany({});
    console.log('🗑️ Anciennes données supprimées');

    // Créer un utilisateur test
    const testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phoneNumber: '0123456789',
      password: 'password123',
      role: 'user'
    });
    await testUser.save();
    console.log('✅ Utilisateur test créé');

    // Créer des agents test
    const agent1 = new User({
      firstName: 'Agent',
      lastName: 'Technique',
      email: 'agent.tech@example.com',
      phoneNumber: '0123456790',
      password: 'password123',
      role: 'agent'
    });
    await agent1.save();

    const agent2 = new User({
      firstName: 'Agent',
      lastName: 'Support',
      email: 'agent.support@example.com',
      phoneNumber: '0123456791',
      password: 'password123',
      role: 'agent'
    });
    await agent2.save();

    console.log('✅ Agents test créés');

    // Afficher les utilisateurs créés
    const users = await User.find({});
    console.log('\n📋 Utilisateurs dans la base de données:');
    users.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Rôle: ${user.role}`);
    });

    console.log('\n🎉 Données de test créées avec succès !');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
    process.exit(1);
  }
}

createTestData(); 