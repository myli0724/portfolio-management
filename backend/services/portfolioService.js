const supabase = require("../db");

exports.getPortfolioSummary = async (userId) => {
    const { data: holdings, error } = await supabase
        .from("stockholder")
        .select("buying_vol, buying_price, ticker:ticker_id(id, ticker_name)")
        .eq("user_id", userId);

    if (error) throw error;

    let totalValue = 0;
    let totalProfit = 0;
    let todayChange = 0;

    const result = [];

    for (const h of holdings) {
        // 获取最近两天的收盘价
        const { data: history } = await supabase
            .from("price_history")
            .select("date, close")
            .eq("tickerph_id", h.ticker.id)
            .order("date", { ascending: false })
            .limit(2);

        if (!history || history.length === 0) continue;

        const latestPrice = history[0].close;
        const prevPrice = history[1] ? history[1].close : latestPrice;

        const stockValue = latestPrice * h.buying_vol;
        const stockProfit = stockValue - h.buying_price * h.buying_vol;
        const stockTodayChange = (latestPrice - prevPrice) * h.buying_vol;

        totalValue += stockValue;
        totalProfit += stockProfit;
        todayChange += stockTodayChange;

        result.push({
            tickerId: h.ticker.id,
            ticker: h.ticker.ticker_name,
            shares: h.buying_vol,
            currentPrice: latestPrice,
            totalValue: stockValue,
            profit: stockProfit,
            profitRate: ((stockProfit / (h.buying_price * h.buying_vol)) * 100).toFixed(2),
            history: history // 或者只返回最近一个月的历史记录
        });
    }

    return {
        summary: {
            totalValue,
            totalProfit,
            todayChange,
            holdingCount: holdings.length
        },
        holdings: result
    };
};
