const stocksService = require("../services/stocksService");

exports.getStockDetails = async (req, res) => {
    try {
        const data = await stocksService.getStockDetails(req.params.tickerId);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getStockDetailsByName = async (req, res) => {
    try {
        const data = await stocksService.getStockDetailsByName(req.query.name);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
