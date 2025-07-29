const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");

router.get("/user/:id/holdings-with-history", portfolioController.getHoldingsWithHistory);

module.exports = router;
