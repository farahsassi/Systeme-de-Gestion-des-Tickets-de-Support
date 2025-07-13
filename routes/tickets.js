const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/", isAuthenticated, ticketController.listTickets);

router.get("/new", isAuthenticated, ticketController.getNewTicketForm);

router.post("/new", isAuthenticated, ticketController.createTicket);

router.get("/:id", isAuthenticated, ticketController.viewTicket);

router.get("/:id/edit", isAuthenticated, ticketController.getEditForm);

router.post("/:id/edit", isAuthenticated, ticketController.updateTicket);

router.post("/:id/delete", isAuthenticated, ticketController.deleteTicket);

router.get("/:id/assign", isAuthenticated, isAdmin, ticketController.getAssignForm);

router.post("/:id/assign", isAuthenticated, isAdmin, ticketController.assignAgent);

router.post("/:id/status", isAuthenticated, isAdmin, ticketController.updateStatus);

module.exports = router;
