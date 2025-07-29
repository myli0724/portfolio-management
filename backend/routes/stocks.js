const express = require("express");
const router = express.Router();
const stocksController = require("../controllers/stocksController");

// GET /stocks/:tickerId/details
router.get("/:tickerId/details", stocksController.getStockDetails);

// GET /stocks/search?name=xxx
router.get("/search", stocksController.getStockDetailsByName);

module.exports = router;
