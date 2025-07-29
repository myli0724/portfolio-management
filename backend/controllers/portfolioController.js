const portfolioService = require("../services/portfolioService");

exports.getHoldingsWithHistory = async (req, res) => {
    try {
        const data = await portfolioService.getHoldingsWithHistory(req.params.id);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};
