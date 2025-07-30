const portfolioService = require("../services/portfolioService");

exports.getPortfolio = async (req, res) => {
    try {
        const data = await portfolioService.getHoldingsWithHistory(req.params.id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.buyStock = async (req, res) => {
    try {
        const { tickerId, quantity, price } = req.body;
        const userId = req.params.id;

        const result = await portfolioService.buyStock(userId, tickerId, quantity, price);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.sellStock = async (req, res) => {
    try {
        const { tickerId, quantity } = req.body;
        const userId = req.params.id;

        const result = await portfolioService.sellStock(userId, tickerId, quantity);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
