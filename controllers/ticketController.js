const Ticket = require("../models/Ticket");
const User = require("../models/User");
const { sendEmail } = require("../services/emailService");

exports.getNewTicketForm = (req, res) => {
  res.render("tickets/new", { error: null });
};

exports.createTicket = async (req, res) => {
  const { title, description, priority, category } = req.body;
  try {
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      category,
      createdBy: req.session.user._id
    });

    await sendEmail(
      req.session.user.email,
      "Création de ticket réussie",
      `Votre ticket "${ticket.title}" a été créé avec succès.`
    );

    
    res.redirect("/tickets");
  } catch (err) {
    console.error(err);
    res.render("tickets/new", { error: "Erreur lors de la création du ticket." });
  }
};

exports.listTickets = async (req, res) => {
  try {
    const query = req.session.user.role === "admin" ? {} : { createdBy: req.session.user._id };
    const tickets = await Ticket.find(query)
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

    res.render("tickets/list", { tickets });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des tickets.");
  }
};

exports.viewTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

    if (!ticket) return res.status(404).send("Ticket introuvable");

    if (req.session.user.role !== "admin" && !ticket.createdBy._id.equals(req.session.user._id)) {
      return res.status(403).send("Accès interdit");
    }

    let agents = [];
    if (req.session.user.role === "admin") {
      agents = await User.find({ role: "agent" }, "firstName lastName email");
    }

    res.render("tickets/view", {
      ticket,
      user: req.session.user,
      agents
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'affichage du ticket.");
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).send("Ticket introuvable");

    if (req.session.user.role !== "admin" && !ticket.createdBy.equals(req.session.user._id)) {
      return res.status(403).send("Accès interdit");
    }

    res.render("tickets/edit", { ticket });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors du chargement du ticket.");
  }
};

exports.updateTicket = async (req, res) => {
  const { title, description, priority, category } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).send("Ticket introuvable");

    if (req.session.user.role !== "admin" && !ticket.createdBy.equals(req.session.user._id)) {
      return res.status(403).send("Accès interdit");
    }

    ticket.title = title;
    ticket.description = description;
    ticket.priority = priority;
    ticket.category = category;
    await ticket.save();

    res.redirect(`/tickets/${ticket._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la mise à jour.");
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).send("Ticket introuvable");

    if (req.session.user.role !== "admin" && !ticket.createdBy.equals(req.session.user._id)) {
      return res.status(403).send("Accès interdit");
    }

    await Ticket.findByIdAndDelete(req.params.id);
    res.redirect("/tickets");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la suppression.");
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id).populate("createdBy", "email firstName lastName");
    if (!ticket) return res.status(404).send("Ticket introuvable");

    ticket.status = status;
    await ticket.save();

    if (ticket.createdBy && ticket.createdBy.email) {
      await sendEmail(
        ticket.createdBy.email,
        `Mise à jour de votre ticket "${ticket.title}"`,
        `Bonjour ${ticket.createdBy.firstName},\n\nLe statut de votre ticket est passé à "${status}".`
      );
    }

    res.redirect(`/tickets/${ticket._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la mise à jour du statut.");
  }
};

exports.getAssignForm = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    const agents = await User.find({ role: "agent" });

    if (!ticket) return res.status(404).send("Ticket introuvable");

    res.render("tickets/assign", { ticket, agents });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'ouverture de l'assignation.");
  }
};

exports.assignAgent = async (req, res) => {
  const { agentId } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).send("Ticket introuvable");

    ticket.assignedTo = agentId;
    await ticket.save();

    res.redirect(`/tickets/${ticket._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'assignation.");
  }
};

exports.dashboard = async (req, res) => {
  try {
    const ouvert = await Ticket.countDocuments({ status: "Ouvert" });
    const encours = await Ticket.countDocuments({ status: "En cours" });
    const resolu = await Ticket.countDocuments({ status: "Résolu" });
    const ferme = await Ticket.countDocuments({ status: "Fermé" });

    res.render("dashboard", {
      stats: { ouvert, encours, resolu, ferme }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors du chargement du tableau de bord.");
  }
};
