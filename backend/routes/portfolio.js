const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");

router.get("/user/:id/portfolio", portfolioController.getPortfolio);

module.exports = router;
