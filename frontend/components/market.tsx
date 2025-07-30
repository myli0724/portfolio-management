"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Clock, TrendingUp, ExternalLink, Filter, X } from "lucide-react"
import Navigation from "@/components/navigation"
import { newsService, NewsItem } from "@/services/newsService"
import { useI18n } from "./i18n-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

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

// Custom hook for typewriter effect
const useTypewriter = (text: string, speed: number = 30) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);
    
    if (!text) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

// News Detail Modal Component
const NewsDetailModal = ({ news, open, onClose, t }: { 
  news: NewsItem | null; 
  open: boolean; 
  onClose: () => void;
  t: (key: string) => string;
}) => {
  const { displayText: summaryText, isComplete: summaryComplete } = useTypewriter(
    news?.summary || '', 
    15
  );

  if (!news) return null;

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
      return <TrendingUp className="h-4 w-4" />;
    }
    if (sentimentLabel.includes("Bearish")) {
      return <TrendingUp className="h-4 w-4 rotate-180" />;
    }
    return <Clock className="h-4 w-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border-0 shadow-2xl rounded-2xl bg-gradient-to-br from-background to-muted/5 backdrop-blur-sm">
        <DialogHeader className="space-y-4 pb-4 border-b border-muted/20">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-bold leading-tight text-foreground pr-4">
              {news.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Modern Meta Info */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="text-sm font-medium px-3 py-1.5 bg-muted/50">
              {news.source}
            </Badge>
            <Badge className={`text-sm font-medium px-3 py-1.5 ${getImpactColor(news.overall_sentiment_label)}`}>
              {getImpactIcon(news.overall_sentiment_label)}
              <span className="ml-1.5">{news.overall_sentiment_label}</span>
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{new Date(news.time_published).toLocaleString()}</span>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          {/* Hero Image with Overlay */}
          {news.banner_image && (
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={news.banner_image}
                alt={news.title}
                className="w-full h-72 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-xl" />
            </div>
          )}

          {/* Summary Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <h3 className="text-xl font-semibold text-foreground">Summary</h3>
            </div>
            <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 rounded-lg p-4">
              {summaryText}
              {!summaryComplete && (
                <span className="animate-pulse text-primary font-bold">|</span>
              )}
            </div>
          </div>

          {/* Related Stocks Section */}
          {news.ticker_sentiment && news.ticker_sentiment.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-primary rounded-full" />
                <h3 className="text-xl font-semibold text-foreground">{t("market.relatedStocks")}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {news.ticker_sentiment.map((stock: { ticker: string }) => (
                  <Badge
                    key={stock.ticker}
                    variant="outline"
                    className="text-sm font-medium px-3 py-1.5 rounded-full border-2 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 cursor-pointer"
                  >
                    {stock.ticker}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-6 border-t border-muted/20">
            <Button
              onClick={() => window.open(news.url, '_blank')}
              className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              {t("market.readFullArticle")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Skeleton Loader Component
const NewsSkeleton = () => (
  <div className="space-y-3">
    {[...Array(6)].map((_, index) => (
      <Card key={index} className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '80%' }} />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '60%' }} />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function Market() {
  const { t } = useI18n();
  const [news, setNews] = useState<NewsItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await newsService.getNews();
        setNews(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
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

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedNews(null)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return t("market.justNow")
    if (diffHours < 24) return t("market.hoursAgo").replace('{{hours}}', diffHours.toString())
    if (diffDays === 1) return t("market.yesterday")
    return t("market.daysAgo").replace('{{days}}', diffDays.toString())
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:ml-64 p-4 lg:p-8 mobile-content lg:desktop-content">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {t("market.title")}
          </h1>
          <p className="text-lg text-muted-foreground/80">{t("market.subtitle")}</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder={t("market.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-xl border-2 bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 focus:border-primary/50 focus:shadow-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 transition-all duration-300 ${
                  selectedCategory === category 
                    ? 'shadow-lg scale-105' 
                    : 'hover:shadow-md hover:scale-105'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* News List - Modern Design */}
        <div className="space-y-4">
          {loading ? (
            <NewsSkeleton />
          ) : (
            filteredNews.map((news: NewsItem, index: number) => (
              <Card
                key={news.id}
                className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-gradient-to-br hover:from-background hover:to-muted/30 animate-fade-in group"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleNewsClick(news)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-5 items-start">
                    {news.banner_image && (
                      <div className="relative overflow-hidden rounded-xl flex-shrink-0">
                        <img
                          src={news.banner_image}
                          alt={news.title}
                          className="w-28 h-28 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    {!news.banner_image && (
                      <div className="w-28 h-28 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex-shrink-0 flex items-center justify-center">
                        <div className="text-muted-foreground">
                          <Clock className="h-8 w-8" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                        {news.summary}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline" className="text-xs font-medium px-2.5 py-1">
                          {news.source}
                        </Badge>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{formatTime(news.time_published)}</span>
                        <div className="ml-auto">
                          <Badge className={`text-xs font-medium px-2.5 py-1 ${
                            news.overall_sentiment_label.includes("Bullish")
                              ? "text-green-700 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800"
                              : news.overall_sentiment_label.includes("Bearish")
                              ? "text-red-700 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800" 
                              : "text-blue-700 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                          }`}>
                            {(() => {
                              if (news.overall_sentiment_label.includes("Bullish")) {
                                return <TrendingUp className="h-3.5 w-3.5" />;
                              }
                              if (news.overall_sentiment_label.includes("Bearish")) {
                                return <TrendingUp className="h-3.5 w-3.5 rotate-180" />;
                              }
                              return <Clock className="h-3.5 w-3.5" />;
                            })()}
                            <span className="ml-1">{news.overall_sentiment_label}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="px-8 py-3 rounded-xl border-2 hover:bg-primary/5 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Loading...</span>
              </div>
            ) : (
              t("market.loadMore")
            )}
          </Button>
        </div>

        {/* News Detail Modal */}
        <NewsDetailModal 
        news={selectedNews} 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        t={t}
      />
      </div>
    </div>
  )
}
