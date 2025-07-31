const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// Enable CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Import routes
const portfolioRoutes = require("./routes/portfolio");
const stocksRoutes = require("./routes/stocks");
const newsRoutes = require("./routes/news");

app.use("/", portfolioRoutes);
app.use("/stocks", stocksRoutes);
app.use("/news", newsRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
}

// Export for Vercel
module.exports = app;
