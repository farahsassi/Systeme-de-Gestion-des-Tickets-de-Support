const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getRegister = (req, res) => {
  res.render("register");
};

exports.postRegister = async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      req.flash("error", "Email déjà utilisé.");
      return res.redirect("/register");
    }

    // Ne pas hasher ici, laisser le modèle s'en occuper
    user = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password, // le hook du modèle va hasher
      role: role || "user"
    });

    await user.save();

    req.session.user = user;
    req.flash("success", "Inscription réussie !");
    res.redirect("/tickets");
  } catch (err) {
    console.error(err);
    req.flash("error", "Erreur lors de l'inscription.");
    res.redirect("/register");
  }
};

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Email ou mot de passe invalide.");
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Email ou mot de passe invalide.");
      return res.redirect("/login");
    }

    req.session.user = user;
    req.flash("success", "Bienvenue !");
    res.redirect("/tickets");
  } catch (err) {
    console.error(err);
    req.flash("error", "Erreur lors de la connexion.");
    res.redirect("/login");
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

