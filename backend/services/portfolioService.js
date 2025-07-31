const supabase = require("../db");

// ✅ 计算用户的资产和可用余额（严格使用买入价 × 数量）
const updateUserBalances = async (userId) => {
    const { data: user } = await supabase
        .from("user")
        .select("total_balance")
        .eq("id", userId)
        .single();

    if (!user) throw new Error("User not found");

    const { data: holdings } = await supabase
        .from("stockholder")
        .select("buying_vol, buying_price")
        .eq("user_id", userId);

    let assets = 0;
    for (const h of holdings) {
        assets += h.buying_vol * h.buying_price;
    }

    const available_balance = user.total_balance - assets;

    await supabase
        .from("user")
        .update({
            assets: parseFloat(assets.toFixed(2)),
            available_balance: parseFloat(available_balance.toFixed(2)),
        })
        .eq("id", userId);

    return {
        total_balance: parseFloat(user.total_balance.toFixed(2)),
        available_balance: parseFloat(available_balance.toFixed(2)),
        assets: parseFloat(assets.toFixed(2)),
    };
};

const getUserBalances = async (userId) => {
    return await updateUserBalances(userId);
};

// ✅ 买入股票
exports.buyStock = async (userId, tickerId, quantity, price) => {
    const balances = await getUserBalances(userId);
    const cost = quantity * price;

    if (cost > balances.available_balance) {
        return {
            success: false,
            error: "Insufficient available balance",
            user: balances // ✅ 让前端拿到余额信息
        };
    }


    const { data: existing } = await supabase
        .from("stockholder")
        .select("*")
        .eq("user_id", userId)
        .eq("ticker_id", tickerId)
        .maybeSingle();

    if (existing) {
        const newVol = Number(existing.buying_vol) + Number(quantity);
        const newPrice =
            (Number(existing.buying_price) * Number(existing.buying_vol) +
                Number(price) * Number(quantity)) /
            newVol;

        await supabase
            .from("stockholder")
            .update({ buying_vol: newVol, buying_price: newPrice })
            .eq("user_id", userId)
            .eq("ticker_id", tickerId);
    } else {
        await supabase
            .from("stockholder")
            .insert([
                { user_id: userId, ticker_id: tickerId, buying_vol: quantity, buying_price: price },
            ]);
    }

    const updatedUser = await updateUserBalances(userId);
    return { success: true, user: updatedUser };
};

// ✅ 卖出股票
exports.sellStock = async (userId, tickerId, quantity) => {
    const { data: rows } = await supabase
        .from("stockholder")
        .select("*")
        .eq("user_id", userId)
        .eq("ticker_id", tickerId);

    if (!rows?.length) throw new Error("No stock holding found");

    const existing = rows[0];
    if (Number(existing.buying_vol) < quantity) throw new Error("Not enough shares to sell");

    const newVol = Number(existing.buying_vol) - quantity;

    if (newVol === 0) {
        await supabase
            .from("stockholder")
            .delete()
            .eq("user_id", userId)
            .eq("ticker_id", tickerId);
    } else {
        await supabase
            .from("stockholder")
            .update({ buying_vol: newVol })
            .eq("user_id", userId)
            .eq("ticker_id", tickerId);
    }

    const updatedUser = await updateUserBalances(userId);
    return { success: true, user: updatedUser };
};

// ✅ 获取用户持仓及资产信息
exports.getHoldingsWithHistory = async (userId) => {
    const { data: holdings } = await supabase
        .from("stockholder")
        .select("buying_vol, buying_price, ticker:ticker_id(id, ticker_name)")
        .eq("user_id", userId);

    if (!holdings) return { summary: {}, holdings: [], user: await updateUserBalances(userId) };

    let totalValue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    let todayChange = 0;
    const result = [];

    for (const h of holdings) {
        const { data: history } = await supabase
            .from("price_history")
            .select("date, close")
            .eq("tickerph_id", h.ticker.id)
            .order("date", { ascending: true })
            .limit(14);

        if (!history || history.length === 0) continue;

        const latestPrice = history[history.length - 1].close;
        const prevPrice = history.length > 1 ? history[history.length - 2].close : latestPrice;

        const value = latestPrice * h.buying_vol;
        const cost = h.buying_price * h.buying_vol;
        const profit = value - cost;

        totalValue += value;
        totalCost += cost;
        totalProfit += profit;
        todayChange += (latestPrice - prevPrice) * h.buying_vol;

        result.push({
            tickerId: h.ticker.id,
            ticker: h.ticker.ticker_name,
            shares: h.buying_vol,
            currentPrice: parseFloat(latestPrice.toFixed(2)),
            totalValue: parseFloat(value.toFixed(2)),
            profit: parseFloat(profit.toFixed(2)),
            profitRate: parseFloat(((profit / cost) * 100).toFixed(2)),
            history,
        });
    }

    const totalChangeRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    const todayChangeRate = totalValue > 0 ? (todayChange / totalValue) * 100 : 0;

    const balances = await updateUserBalances(userId);

    return {
        summary: {
            totalValue: parseFloat(totalValue.toFixed(2)),
            totalProfit: parseFloat(totalProfit.toFixed(2)),
            totalChangeRate: parseFloat(totalChangeRate.toFixed(2)),
            todayChange: parseFloat(todayChange.toFixed(2)),
            todayChangeRate: parseFloat(todayChangeRate.toFixed(2)),
            holdingCount: holdings.length,
        },
        holdings: result,
        user: balances,
    };
};


