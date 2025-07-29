const supabase = require("../db");

exports.getHoldingsWithHistory = async (userId) => {
    const { data: holdings, error: holdingsError } = await supabase
        .from("stockholder")
        .select("buying_vol, buying_price, ticker:ticker_id(id, ticker_name)")
        .eq("user_id", userId);

    if (holdingsError) throw holdingsError;

    const result = [];

    for (const h of holdings) {
        const { data: history, error: historyError } = await supabase
            .from("price_history")
            .select("date, close")
            .eq("tickerph_id", h.ticker.id)
            .order("date", { ascending: true })
            .limit(14);

        if (historyError) throw historyError;

        const latestPrice = history.length > 0 ? history[history.length - 1].close : 0;
        const totalValue = latestPrice * h.buying_vol;
        const totalCost = h.buying_price * h.buying_vol;
        const profit = totalValue - totalCost;
        const profitRate = totalCost > 0 ? (profit / totalCost) * 100 : 0;

        result.push({
            tickerId: h.ticker.id,
            ticker: h.ticker.ticker_name,
            shares: h.buying_vol,
            currentPrice: latestPrice,
            totalValue,
            profit,
            profitRate,
            history
        });
    }

    return result;
};
