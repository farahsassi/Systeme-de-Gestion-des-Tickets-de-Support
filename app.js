const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const chatbotRouter = require("./routes/chatbot");
dotenv.config();
const connectDB = require("./config/db");
connectDB();

const app = express();
const server = http.createServer(app); // Créer un serveur HTTP pour Socket.IO
const io = new Server(server); // Initialiser Socket.IO

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Ajouter le middleware pour parser le JSON
app.use(cookieParser());
app.use(
  session({
    secret: "support_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(express.static(path.join(__dirname, "public")));

// Configurer le moteur de vue
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes existantes
app.use("/", require("./routes/auth"));
app.use("/tickets", require("./routes/tickets"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/chatbot", chatbotRouter);
// Intégration avec l'API de Grok
const XAI_API_KEY = process.env.XAI_API_KEY;
const XAI_API_URL = "https://api.proxyxai.com/v1/chat/completions";

io.on("connection", (socket) => {
  console.log("Utilisateur connecté au chatbot");

  socket.on("chat message", async (msg) => {
    console.log("Message reçu : " + msg);

    try {
      // Appeler l'API de Grok
      const response = await axios.post(
        XAI_API_URL,
        {
          model: "grok-3", // Utiliser le modèle Grok
          messages: [{ role: "user", content: msg }],
          max_tokens: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${XAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botResponse = response.data.choices[0].message.content || "Désolé, je n'ai pas de réponse.";
      socket.emit("bot response", botResponse);
    } catch (error) {
      console.error("Erreur avec l'API xAI :", error.response ? error.response.data : error.message);
      socket.emit("bot response", "Désolé, une erreur est survenue avec le chatbot.");
    }
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté du chatbot");
  });
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
