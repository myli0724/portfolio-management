### 数据库设计 (SQL)

首先，您需要在您的 Supabase 项目中执行以下 SQL 来创建 `news` 表。这张表用来存储从 Alpha Vantage API 获取的新闻数据。

```sql
CREATE TABLE news (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    time_published TIMESTAMPTZ,
    authors TEXT[],
    summary TEXT,
    banner_image TEXT,
    source TEXT,
    category_within_source TEXT,
    source_domain TEXT,
    topics JSONB,
    overall_sentiment_score REAL,
    overall_sentiment_label TEXT,
    ticker_sentiment JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**关键设计点:**
*   `url` 字段是唯一的，这可以防止重复插入相同的新闻。
*   `topics` 和 `ticker_sentiment` 字段使用了 `JSONB` 类型，这对于存储来自 API 的可变和嵌套的 JSON 数据非常理想。
*   `time_published` 使用 `TIMESTAMPTZ` 来准确存储带时区的时间信息。

### 后端设计方案

我们已经创建了后端的模块化结构：

1.  **`routes/news.js`**: 定义了新闻相关的路由，目前是 `GET /news`。
2.  **`controllers/newsController.js`**: 控制器负责处理进来的请求，调用服务层处理业务逻辑，并返回响应。
3.  **`services/newsService.js`**: 这是核心服务。它会:
    *   调用 Alpha Vantage API 获取最新新闻。
    *   将获取到的新闻数据通过 `upsert` 操作存入 Supabase 的 `news` 表。`upsert` 会根据唯一的 `url` 来避免重复存储。
    *   从数据库中查询所有新闻并返回。
4.  **`server.js`**: 已更新此文件，以引入并使用 `/news` 路由。

**重要提示**: 请确保在您后端的 `.env` 文件中添加您的 Alpha Vantage API 密钥：

```
ALPHA_VANTAGE_API_KEY=YOUR_API_KEY_HERE
```