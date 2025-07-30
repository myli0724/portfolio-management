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

exports.buyStock = async (req, res) => {
    const { tickerId, quantity, price } = req.body;
    const userId = req.params.id; // 从 URL 获取 userId

    try {
        const result = await stocksService.buyStock(userId, tickerId, quantity, price);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.sellStock = async (req, res) => {
    const { tickerId, quantity } = req.body;
    const userId = req.params.id;

    try {
        const result = await stocksService.sellStock(userId, tickerId, quantity);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
