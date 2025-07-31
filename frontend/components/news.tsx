"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Clock, TrendingUp, ExternalLink, Filter, Newspaper, Flame } from "lucide-react"
import Navigation from "@/components/navigation"
import { newsService, NewsItem } from "@/services/newsService"
import { useI18n } from "@/components/i18n-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

// Dynamic categories based on backend topics
const getCategoriesFromTopics = (news: NewsItem[]): string[] => {
  const allTopics = new Set<string>()
  news.forEach(item => {
    item.topics?.forEach((topic: string) => {
      if (topic && typeof topic === 'string') {
        allTopics.add(topic.trim())
      }
    })
  })
  
  const uniqueTopics = Array.from(allTopics).filter(topic => topic && topic !== "全部")
  const categories = ["全部", ...uniqueTopics]
  return categories.length > 1 ? categories : ["全部", "财经", "公司", "宏观", "科技", "监管", "产品", "热门"]
}

// Custom hook for animated counter
const useAnimatedCounter = (targetValue: number, duration: number = 1000) => {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setCurrentValue(Math.floor(targetValue * progress))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    setCurrentValue(0)
    animate()
  }, [targetValue, duration])

  return currentValue
}

// News Detail Modal with default theme
const NewsDetailModal = ({ news, open, onClose, t }: { 
  news: NewsItem | null; 
  open: boolean; 
  onClose: () => void;
  t: (key: string) => string;
}) => {
  if (!news) return null

  const getImpactColor = (sentimentLabel: string) => {
    if (sentimentLabel.includes("Bullish")) {
      return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800";
    }
    if (sentimentLabel.includes("Bearish")) {
      return "text-rose-600 bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800";
    }
    return "text-sky-600 bg-sky-100 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800";
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
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border shadow-lg rounded-2xl bg-background">
        <DialogHeader className="space-y-4 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-bold leading-tight text-foreground pr-4">
              {news.title}
            </DialogTitle>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="text-sm font-medium px-3 py-1.5">
              {news.source}
            </Badge>
            <Badge className={`text-sm font-medium px-3 py-1.5 ${getImpactColor(news.overall_sentiment_label)}`}>
              {getImpactIcon(news.overall_sentiment_label)}
              <span className="ml-1.5">{news.overall_sentiment_label}</span>
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{new Date(news.time_published).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          {news.banner_image && (
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={news.banner_image}
                alt={news.title}
                className="w-full h-72 object-cover rounded-xl"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold text-foreground">新闻摘要</h3>
            </div>
            <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 rounded-lg p-4 border border-border">
              {news.summary}
            </div>
          </div>

          {news.ticker_sentiment && news.ticker_sentiment.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-foreground" />
                <h3 className="text-xl font-semibold text-foreground">相关股票</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {news.ticker_sentiment.map((stock: { ticker: string }) => (
                  <Badge
                    key={stock.ticker}
                    variant="outline"
                    className="text-sm font-medium px-3 py-1.5 rounded-full border hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer"
                  >
                    {stock.ticker}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-border">
            <Button
              onClick={() => window.open(news.url, '_blank')}
              className="w-full h-12 text-base"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              阅读全文
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Default theme Skeleton Loader
const NewsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <Card key={index} className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-5 items-start">
            <div className="w-28 h-28 bg-muted rounded-xl flex-shrink-0 animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-muted rounded-md w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded-md w-full animate-pulse" />
              <div className="h-4 bg-muted rounded-md w-5/6 animate-pulse" />
              <div className="flex gap-3 pt-2">
                <div className="h-6 bg-muted rounded-full w-16 animate-pulse" />
                <div className="h-6 bg-muted rounded-full w-20 animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)


export default function News() {
  const { t } = useI18n()
  const [news, setNews] = useState<NewsItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [categories, setCategories] = useState<string[]>(["全部"])
  const itemsPerPage = 10

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true)
        const data = await newsService.getNews()
        setNews(data)
        
        // Generate categories from topics
        const dynamicCategories = getCategoriesFromTopics(data)
        setCategories(dynamicCategories)
        
      } catch (error) {
        console.error('Failed to fetch news:', error)
        // Fallback to mock data if API fails
        setNews([
          
        ])
        setCategories(["全部", "财经", "公司", "宏观", "科技", "监管", "产品", "热门"])
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedCategory])

  const filteredNews = news.filter((news: NewsItem) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "全部" || 
      (news.topics && news.topics.includes(selectedCategory))
    return matchesSearch && matchesCategory
  })

  const paginatedNews = filteredNews.slice(0, page * itemsPerPage)
  const hasMoreNews = filteredNews.length > page * itemsPerPage

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedNews(null)
  }

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return "刚刚"
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays === 1) return "昨天"
    return `${diffDays}天前`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:ml-64 p-4 lg:p-8 mobile-content lg:desktop-content">
        {/* Header with Red Theme */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              新闻资讯
            </h1>
          </div>
          <p className="text-lg text-muted-foreground/80">实时掌握市场动态，洞察投资机会</p>
        </div>


        {/* Search and Filter with Red Theme */}
        <div className="mb-8 space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 h-5 w-5 transition-colors group-focus-within:text-red-600" />
            <Input
              placeholder="搜索新闻标题或内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-xl border-2 border-red-200 bg-background/80 backdrop-blur-sm focus:bg-background transition-all duration-300 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 focus:ring-2 focus:ring-red-500/20"
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
                className="whitespace-nowrap rounded-full px-4 py-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* News List - Red Theme Design */}
        <div className="space-y-4">
          {loading ? (
            <NewsSkeleton />
          ) : (
            paginatedNews.map((news: NewsItem, index: number) => (
              <Card
                key={news.id}
                className="border border-red-200/50 shadow-lg hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 cursor-pointer bg-gradient-to-br from-card to-red-50/5 dark:from-card dark:to-red-950/5 backdrop-blur-sm group hover:border-red-300/50"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleNewsClick(news)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-5 items-start">
                    {news.banner_image && (
                      <div className="relative overflow-hidden rounded-xl flex-shrink-0 shadow-md">
                        <img
                          src={news.banner_image}
                          alt={news.title}
                          className="w-28 h-28 object-cover rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                    )}
                    {!news.banner_image && (
                      <div className="w-28 h-28 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                        <div className="text-red-600 dark:text-red-400">
                          <Newspaper className="h-8 w-8" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-foreground line-clamp-2 mb-2 group-hover:text-red-600 transition-colors duration-300">
                        {news.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300">
                        {news.summary}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline" className="text-xs font-medium px-2.5 py-1 border-red-200 group-hover:border-red-300 transition-colors duration-300">
                          {news.source}
                        </Badge>
                        <span className="text-red-300">•</span>
                        <span className="text-muted-foreground group-hover:text-muted-foreground/90 transition-colors duration-300">{formatTime(news.time_published)}</span>
                        <div className="ml-auto">
                          <Badge className={`text-xs font-medium px-2.5 py-1 ${
                            news.overall_sentiment_label.includes("看涨")
                              ? "text-red-700 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800"
                              : news.overall_sentiment_label.includes("看跌")
                              ? "text-rose-700 bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800" 
                              : "text-orange-700 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800"
                          }`}>
                            {(() => {
                              if (news.overall_sentiment_label.includes("看涨")) {
                                return <TrendingUp className="h-3.5 w-3.5" />
                              }
                              if (news.overall_sentiment_label.includes("看跌")) {
                                return <TrendingUp className="h-3.5 w-3.5 rotate-180" />
                              }
                              return <Flame className="h-3.5 w-3.5" />
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

        {/* Load More with Red Theme */}
        {paginatedNews.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="min-w-[200px] h-12 text-base border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 rounded-xl transition-all duration-300"
              onClick={handleLoadMore}
              disabled={!hasMoreNews}
            >
              {hasMoreNews ? "加载更多" : "已加载全部"}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {paginatedNews.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">暂无相关新闻</h3>
            <p className="text-muted-foreground">请尝试调整搜索条件或筛选分类</p>
          </div>
        )}

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
