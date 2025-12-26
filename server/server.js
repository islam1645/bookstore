const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors'); // Assure-toi que c'est bien importé
const connectDB = require('./config/db');

connectDB();

const app = express();

// --- CORRECTION CORS ICI ---
// On autorise explicitement ton site Vercel et ton localhost
app.use(cors({
    origin: [
        "http://localhost:5173",                     // Pour tes tests sur PC
        "https://kutubdz.vercel.app",     // TON ADRESSE VERCEL ACTUELLE (Celle de la capture)
        "https://bookstore.vercel.app"               // Au cas où tu renommes plus tard
    ],
    credentials: true // Important pour laisser passer les cookies/tokens si besoin
    methods: ["GET", "POST", "PUT", "DELETE"], // Les actions autorisées
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// ---------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- C'EST ICI QU'ON BRANCHE LES ROUTES ---
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));