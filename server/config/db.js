const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // On désactive le mode strict pour faciliter les modifications futures
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    process.exit(1); // Arrête le serveur si la DB plante
  }
};

module.exports = connectDB;