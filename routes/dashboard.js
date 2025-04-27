const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/", isAuthenticated, isAdmin, ticketController.dashboard);

module.exports = router;


