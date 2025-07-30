const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");

router.get("/user/:id/portfolio", portfolioController.getPortfolio);

// 买入股票
router.post("/user/:id/buy", portfolioController.buyStock);

// 卖出股票
router.post("/user/:id/sell", portfolioController.sellStock);

module.exports = router;
