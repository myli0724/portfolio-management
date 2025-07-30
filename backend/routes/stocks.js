const express = require("express");
const router = express.Router();
const stocksController = require("../controllers/stocksController");

// GET /stocks/:tickerId/details
router.get("/:tickerId/details", stocksController.getStockDetails);

// GET /stocks/search?name=xxx
router.get("/search", stocksController.getStockDetailsByName);

router.post("/:id/buy", stocksController.buyStock);
router.post("/:id/sell", stocksController.sellStock);

module.exports = router;
