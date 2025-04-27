
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  req.flash("error", "Veuillez vous connecter pour accéder à cette page.");
  return res.redirect("/login");
};

exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  req.flash("error", "Accès refusé : réservé aux administrateurs.");
  return res.status(403).send("Accès refusé : admin uniquement");
};

exports.isAgent = (req, res, next) => {
  if (req.session.user && req.session.user.role === "agent") {
    return next();
  }
  req.flash("error", "Accès refusé : réservé aux agents de support.");
  return res.status(403).send("Accès refusé : agent uniquement");
};

// Pour restreindre la création aux utilisateurs normaux
exports.isUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === "user") {
    return next();
  }
  res.status(403).send("Accès réservé aux utilisateurs.");
};
