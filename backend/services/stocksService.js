const supabase = require("../db");

exports.getStockDetails = async (tickerId) => {
    // 获取股票基本信息
    const { data: tickerData, error: tickerError } = await supabase
        .from("ticker")
        .select("id, ticker_name")
        .eq("id", tickerId)
        .single();

    if (tickerError || !tickerData) throw new Error("Ticker not found");

    // 获取最近一次交易日的数据
    const { data: recentData, error: recentError } = await supabase
        .from("price_history")
        .select("date, open, close, high, low, volume")
        .eq("tickerph_id", tickerId)
        .order("date", { ascending: false })
        .limit(1);

    if (recentError || !recentData.length) throw new Error("No price history found");

    const recent = recentData[0];

    // 获取最近 14 天的收盘价走势
    const { data: history, error: historyError } = await supabase
        .from("price_history")
        .select("date, close")
        .eq("tickerph_id", tickerId)
        .order("date", { ascending: true })
        .limit(14);

    if (historyError) throw historyError;

    return {
        ticker_name: tickerData.ticker_name,
        recent_open_price: parseFloat(recent.open.toFixed(2)),
        recent_close_price: parseFloat(recent.close.toFixed(2)),
        date: recent.date,
        market_value: parseFloat((recent.close * recent.volume).toFixed(2)),
        volume: recent.volume,
        high: parseFloat(recent.high.toFixed(2)),
        low: parseFloat(recent.low.toFixed(2)),
        history: history.map((h) => ({
            date: h.date,
            close: parseFloat(h.close.toFixed(2)),
        })),
    };
};

exports.getStockDetailsByName = async (tickerName) => {
    // 先找到 ticker 的 id
    const { data: tickerData, error: tickerError } = await supabase
        .from("ticker")
        .select("id, ticker_name")
        .ilike("ticker_name", `%${tickerName}%`) // 模糊匹配
        .single();

    if (tickerError || !tickerData) throw new Error("Ticker not found");

    // 复用已有的 getStockDetails 方法
    return await exports.getStockDetails(tickerData.id);
};

