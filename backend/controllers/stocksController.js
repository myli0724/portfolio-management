exports.getStockDetailsByName = async (req, res) => {
    try {
        const data = await stocksService.getStockDetailsByName(req.query.name); // 通过 query 获取名称
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
