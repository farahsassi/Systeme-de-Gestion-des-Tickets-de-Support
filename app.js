const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

dotenv.config();
const connectDB = require("./config/db");
connectDB();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "support_secret_key",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null; 
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.use("/", require("./routes/auth"));
app.use("/tickets", require("./routes/tickets"));
app.use("/dashboard", require("./routes/dashboard"));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Serveur démarré sur http://localhost:${PORT}`));
