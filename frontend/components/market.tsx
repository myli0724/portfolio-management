"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Clock, TrendingUp, ExternalLink, Filter } from "lucide-react"
import Navigation from "@/components/navigation"
import { newsService, NewsItem } from "@/services/newsService"
import { useI18n } from "./i18n-provider"

// Mock news data
const mockNews = [ // This will be replaced by API data
  {
    id: "1",
    title: "Apple Reports Quarterly Earnings, Revenue Beats Expectations",
    summary:
      "Apple today released its Q1 2024 financial results, reporting revenue of $119.6 billion, up 2.1% year-over-year and exceeding analysts’ expectations. Strong iPhone sales and continued growth in its services business drove the results.",
    source: "Finance News",
    time: "2 Hours Ago",
    category: "Earnings Report",
    impact: "positive",
    relatedStocks: ["AAPL"],
    image: "/placeholder.svg?height=200&width=300&text=Apple+News",
  },
  {
    id: "2",
    title: "Tesla Announces Expansion of Shanghai Gigafactory",
    summary:
      "Tesla has announced an additional $5 billion investment in its Shanghai Gigafactory to expand production capacity and develop new technologies. The expansion is expected to boost Tesla’s annual production capacity in China to 2 million vehicles.",
    source: "Automotive News",
    time: "4 Hours Ago",
    category: "Company Update",
    impact: "positive",
    relatedStocks: ["TSLA"],
    image: "/placeholder.svg?height=200&width=300&text=Tesla+Factory",
  },
  {
    id: "3",
    title: "Fed Hints at Possible Adjustment to Interest Rate Policy",
    summary:
      "In the latest speech, the Federal Reserve Chair indicated that considering the current economic conditions and inflation levels, the central bank may adjust its interest rate policy at the next meeting. Markets reacted cautiously.",
    source: "Central Bank Updates",
    time: "6 Hours Ago",
    category: "Macroeconomy",
    impact: "neutral",
    relatedStocks: ["SPY", "QQQ"],
    image: "/placeholder.svg?height=200&width=300&text=Federal+Reserve",
  },
  {
    id: "4",
    title: "Microsoft Azure Cloud Revenue Shows Strong Growth",
    summary:
      "Microsoft reported a 30% year-over-year growth in Azure cloud services last quarter, maintaining its leading position in the cloud computing market. Rapid growth in AI services was a key driver of this performance.",
    source: "Tech Insights",
    time: "8 Hours Ago",
    category: "Technology",
    impact: "positive",
    relatedStocks: ["MSFT"],
    image: "/placeholder.svg?height=200&width=300&text=Microsoft+Azure",
  },
  {
    id: "5",
    title: "Google Faces New Antitrust Investigation",
    summary:
      "The European Commission announced a new antitrust investigation into Google's advertising business, focusing on whether its dominance in digital ads constitutes unfair competition.",
    source: "Legal News",
    time: "12 Hours Ago",
    category: "Regulation",
    impact: "negative",
    relatedStocks: ["GOOGL"],
    image: "/placeholder.svg?height=200&width=300&text=Google+Investigation",
  },
  {
    id: "6",
    title: "NVIDIA Unveils Next-Generation H200 AI Chip",
    summary:
      "NVIDIA launched its latest H200 AI chip, which delivers 60% more performance than the previous generation. The new chip is designed for large language model training and inference, further strengthening NVIDIA’s leadership in the AI chip market.",
    source: "Tech News",
    time: "1 Day Ago",
    category: "Product Launch",
    impact: "positive",
    relatedStocks: ["NVDA"],
    image: "/placeholder.svg?height=200&width=300&text=NVIDIA+H200",
  },
]

const categories = ["All",
  "Earnings",
  "Company News",
  "Macroeconomy",
  "Technology",
  "Regulation",
  "Product Launch",];

export default function Market() {
  const { t } = useI18n();
  const [news, setNews] = useState<NewsItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await newsService.getNews();
        setNews(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };

    loadNews();
  }, []);

  const filteredNews = news.filter((news: NewsItem) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || news.overall_sentiment_label === selectedCategory
    return matchesSearch && matchesCategory
  })

    const getImpactColor = (sentimentLabel: string) => {
    if (sentimentLabel.includes("Bullish")) {
      return "text-green-600 bg-green-100 dark:bg-green-900/20";
    }
    if (sentimentLabel.includes("Bearish")) {
      return "text-red-600 bg-red-100 dark:bg-red-900/20";
    }
    return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
  };

    const getImpactIcon = (sentimentLabel: string) => {
    if (sentimentLabel.includes("Bullish")) {
      return <TrendingUp className="h-3 w-3" />;
    }
    if (sentimentLabel.includes("Bearish")) {
      return <TrendingUp className="h-3 w-3 rotate-180" />;
    }
    return <Clock className="h-3 w-3" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:ml-64 p-4 lg:p-8 mobile-content lg:desktop-content">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("market.title")}</h1>
          <p className="text-muted-foreground">{t("market.subtitle")}</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("market.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* News List */}
        <div className="space-y-6">
          {filteredNews.map((news: NewsItem) => (
            <Card key={news.id} className="border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Image */}
                  <div className="md:col-span-1">
                    <img
                      src={news.banner_image || "/placeholder.svg"}
                      alt={news.title}
                      className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    />
                  </div>

                  {/* Content */}
                  <div className="md:col-span-3 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {news.source}
                        </Badge>
                        <Badge className={`text-xs ${getImpactColor(news.overall_sentiment_label)}`}>
                          {getImpactIcon(news.overall_sentiment_label)}
                          <span className="ml-1">{news.overall_sentiment_label}</span>
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(news.time_published).toLocaleString()}
                        </div>
                      </div>
                      <a href={news.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{news.title}</h3>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{news.summary}</p>

                    {/* Related Stocks */}
                    {news.ticker_sentiment && news.ticker_sentiment.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{t("market.relatedStocks")}:</span>
                        <div className="flex gap-1">
                          {news.ticker_sentiment.map((stock: { ticker: string }) => (
                            <Badge
                              key={stock.ticker}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-red-600/10 hover:border-red-600 hover:text-red-600"
                            >
                              {stock.ticker}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="px-8 bg-transparent">
            {t("market.loadMore")}
          </Button>
        </div>
      </div>
    </div>
  )
}
