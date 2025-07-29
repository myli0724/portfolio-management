const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


app.get("/user/:id/holdings-with-history", async (req, res) => {
    const userId = req.params.id;

    // Get user's holdings
    const { data: holdings, error: holdingsError } = await supabase
        .from("stockholder")
        .select(`
      buying_vol,
      buying_price,
      ticker:ticker_id (id, ticker_name)
    `)
        .eq("user_id", userId);

    if (holdingsError) {
        return res.status(500).json({ success: false, error: holdingsError });
    }

    const result = [];

    // For each stock, get full price history
    for (const h of holdings) {
        const { data: history, error: historyError } = await supabase
            .from("price_history")
            .select("date, close")
            .eq("tickerph_id", h.ticker.id)
            .order("date", { ascending: true })
            .limit(14);

        if (historyError) continue;

        const latestPrice = history.length > 0 ? history[history.length - 1].close : 0;
        const totalValue = latestPrice * h.buying_vol;
        const totalCost = h.buying_price * h.buying_vol;
        const profit = totalValue - totalCost;
        const profitRate = totalCost > 0 ? (profit / totalCost) * 100 : 0;

        result.push({
            ticker: h.ticker.ticker_name,
            shares: h.buying_vol,
            currentPrice: latestPrice,
            totalValue,
            profit,
            profitRate,
            history // full price history for chart
        });
    }

    res.json({ success: true, data: result });
});




// testing endpoint to check if the server is running and connected to the database
app.get("/test-db", async (req, res) => {
    const { data, error } = await supabase.from("user").select("*").limit(1);
    if (error) return res.status(500).json({ success: false, error });
    res.json({ success: true, data });
});
//
// // endpoint to get user information by ID
// app.get("/user/:id/stocks", async (req, res) => {
//     const userId = req.params.id;
//
//     const { data, error } = await supabase
//       .from("stockholder")
//       .select("buying_vol, buying_time, ticker:ticker_id(ticker_name)")
//       .eq("user_id", userId);
//
//     if (error) return res.status(500).json({ success: false, error });
//     res.json({ success: true, data });
//   });
//
// // endpoint to get all tickers by ID
// app.get("/ticker/:id/latest-price", async (req, res) => {
// const tickerId = req.params.id;
//
// const { data, error } = await supabase
//     .from("price_history")
//     .select("*")
//     .eq("tickerph_id", tickerId)
//     .order("date", { ascending: false })
//     .limit(1);
//
// if (error) return res.status(500).json({ success: false, error });
// res.json({ success: true, data: data[0] });
// });
//
// app.get("/user/:id/stocks-with-prices", async (req, res) => {
//     const userId = req.params.id;
//
//     const { data: holdings, error } = await supabase
//       .from("stockholder")
//       .select("buying_vol, ticker:ticker_id(id, ticker_name)")
//       .eq("user_id", userId);
//
//     if (error) return res.status(500).json({ success: false, error });
//
//     const result = [];
//
//     for (const h of holdings) {
//       const { data: latest } = await supabase
//         .from("price_history")
//         .select("*")
//         .eq("tickerph_id", h.ticker.id)
//         .order("date", { ascending: false })
//         .limit(1);
//
//       result.push({
//         ticker: h.ticker.ticker_name,
//         shares: h.buying_vol,
//         latestPrice: latest?.[0]?.close || null
//       });
//     }
//
//     res.json({ success: true, data: result });
//   });


app.listen(3001, () => console.log("✅ Server running on http://localhost:3001"));

