const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["Faible", "Moyenne", "Élevée"], required: true },
  category: { type: String, default: "Général" }, 
  status: { type: String, enum: ["Ouvert", "En cours", "Résolu", "Fermé"], default: "Ouvert" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true }); 

module.exports = mongoose.model("Ticket", ticketSchema);
