const supabase = require("../db");

exports.getHoldingsWithHistory = async (userId) => {
    const { data: holdings, error: holdingsError } = await supabase
        .from("stockholder")
        .select("buying_vol, buying_price, ticker:ticker_id(id, ticker_name)")
        .eq("user_id", userId);

    if (holdingsError) throw holdingsError;

    const result = [];
    let totalValue = 0;
    let totalCost = 0;
    let todayChange = 0;

    for (const h of holdings) {
        const { data: history, error: historyError } = await supabase
            .from("price_history")
            .select("date, close")
            .eq("tickerph_id", h.ticker.id)
            .order("date", { ascending: false })
            .limit(14);

        if (historyError) throw historyError;

        const latestPrice = history.length > 0 ? history[history.length - 1].close : 0;
        const prevPrice = history.length > 1 ? history[history.length - 2].close : latestPrice;

        const totalValueStock = latestPrice * h.buying_vol;
        const totalCostStock = h.buying_price * h.buying_vol;
        const profit = totalValueStock - totalCostStock;
        const profitRate = totalCostStock > 0 ? (profit / totalCostStock) * 100 : 0;

        totalValue += totalValueStock;
        totalCost += totalCostStock;
        todayChange += (latestPrice - prevPrice) * h.buying_vol;

        result.push({
            tickerId: h.ticker.id,
            ticker: h.ticker.ticker_name,
            shares: parseFloat(h.buying_vol.toFixed(2)),
            currentPrice: parseFloat(latestPrice.toFixed(2)),
            totalValue: parseFloat(totalValueStock.toFixed(2)),
            profit: parseFloat(profit.toFixed(2)),
            profitRate: parseFloat(profitRate.toFixed(2)),
            history
        });
    }

    const totalProfit = totalValue - totalCost;
    const totalChangeRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    const todayChangeRate =
        totalValue - todayChange !== 0 ? (todayChange / (totalValue - todayChange)) * 100 : 0;

    return {
        summary: {
            totalValue: parseFloat(totalValue.toFixed(2)),
            totalProfit: parseFloat(totalProfit.toFixed(2)),
            totalChangeRate: parseFloat(totalChangeRate.toFixed(2)),
            todayChange: parseFloat(todayChange.toFixed(2)),
            todayChangeRate: parseFloat(todayChangeRate.toFixed(2)),
            holdingCount: holdings.length
        },
        holdings: result
    };
};

