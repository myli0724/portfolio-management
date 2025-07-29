const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// ✅ Enable CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// ✅ Import routes
const portfolioRoutes = require("./routes/portfolio");
// 未来还可以添加 stockRoutes 等
app.use("/", portfolioRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
