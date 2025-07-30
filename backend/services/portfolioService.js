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

// 买入股票
exports.buyStock = async (userId, tickerId, quantity, price) => {
    const { data: existing, error: selectError } = await supabase
        .from("stockholder")
        .select("*")
        .eq("user_id", userId)
        .eq("ticker_id", tickerId)
        .single();

    if (selectError && selectError.code !== "PGRST116") {
        return { error: selectError };
    }

    if (existing) {
        // 更新数量和平均买入价格
        const newVol = Number(existing.buying_vol) + Number(quantity);
        const newPrice =
            (Number(existing.buying_price) * Number(existing.buying_vol) +
                Number(price) * Number(quantity)) /
            newVol;

        return await supabase
            .from("stockholder")
            .update({ buying_vol: newVol, buying_price: newPrice })
            .eq("user_id", userId)
            .eq("ticker_id", tickerId); // 用联合主键更新
    } else {
        // 插入新记录
        return await supabase.from("stockholder").insert([
            {
                user_id: userId,
                ticker_id: tickerId,
                buying_vol: quantity,
                buying_price: price,
            },
        ]);
    }
};


// 卖出股票
exports.sellStock = async (userId, tickerId, quantity) => {
    // 这里不再用 .single()，改成 select 后手动取第一个
    const { data: rows, error } = await supabase
        .from("stockholder")
        .select("*")
        .eq("user_id", userId)
        .eq("ticker_id", tickerId);

    if (error) return { error };
    if (!rows || rows.length === 0) throw new Error("No stock holding found");

    const existing = rows[0]; // ✅ 取第一条
    const currentVol = Number(existing.buying_vol);

    if (currentVol < quantity) throw new Error("Not enough shares to sell");

    const newVol = currentVol - quantity;

    if (newVol === 0) {
        // 删除记录
        return await supabase
            .from("stockholder")
            .delete()
            .eq("user_id", userId)
            .eq("ticker_id", tickerId);
    } else {
        // 更新数量
        return await supabase
            .from("stockholder")
            .update({ buying_vol: newVol })
            .eq("user_id", userId)
            .eq("ticker_id", tickerId);
    }
};

