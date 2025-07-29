const portfolioService = require("../services/portfolioService");

exports.getPortfolio = async (req, res) => {
    try {
        const data = await portfolioService.getHoldingsWithHistory(req.params.id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
