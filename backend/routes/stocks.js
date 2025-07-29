const express = require("express");
const router = express.Router();
const stocksController = require("../controllers/stocksController");

// GET /stocks/:tickerId/details
router.get("/:tickerId/details", stocksController.getStockDetails);
router.get("/search", stocksController.getStockDetailsByName);

module.exports = router;
