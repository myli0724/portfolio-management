"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Clock, TrendingUp, ExternalLink, Filter } from "lucide-react"
import Navigation from "@/components/navigation"

// Mock news data
const mockNews = [
  {
    id: "1",
    title: "苹果公司发布最新季度财报，营收超预期",
    summary:
      "苹果公司今日发布了2024年第一季度财报，营收达到1196亿美元，同比增长2.1%，超出分析师预期。iPhone销售表现强劲，服务业务继续保持增长势头。",
    source: "财经新闻",
    time: "2小时前",
    category: "财报",
    impact: "positive",
    relatedStocks: ["AAPL"],
    image: "/placeholder.svg?height=200&width=300&text=Apple+News",
  },
  {
    id: "2",
    title: "特斯拉宣布在中国扩建超级工厂",
    summary:
      "特斯拉宣布将在上海超级工厂投资额外50亿美元，用于扩大产能和研发新技术。此举预计将使特斯拉在中国的年产能提升至200万辆。",
    source: "汽车资讯",
    time: "4小时前",
    category: "公司动态",
    impact: "positive",
    relatedStocks: ["TSLA"],
    image: "/placeholder.svg?height=200&width=300&text=Tesla+Factory",
  },
  {
    id: "3",
    title: "美联储暗示可能调整利率政策",
    summary:
      "美联储主席在最新讲话中暗示，考虑到当前经济形势和通胀水平，央行可能在下次会议上调整利率政策。市场对此反应谨慎。",
    source: "央行动态",
    time: "6小时前",
    category: "宏观经济",
    impact: "neutral",
    relatedStocks: ["SPY", "QQQ"],
    image: "/placeholder.svg?height=200&width=300&text=Federal+Reserve",
  },
  {
    id: "4",
    title: "微软Azure云服务营收增长强劲",
    summary:
      "微软公布Azure云服务在上季度实现了30%的同比增长，继续在云计算市场保持领先地位。AI服务的快速发展成为增长的主要驱动力。",
    source: "科技前沿",
    time: "8小时前",
    category: "科技",
    impact: "positive",
    relatedStocks: ["MSFT"],
    image: "/placeholder.svg?height=200&width=300&text=Microsoft+Azure",
  },
  {
    id: "5",
    title: "谷歌面临新的反垄断调查",
    summary:
      "欧盟委员会宣布对谷歌的广告业务展开新一轮反垄断调查，重点关注其在数字广告市场的主导地位是否构成不公平竞争。",
    source: "法律资讯",
    time: "12小时前",
    category: "监管",
    impact: "negative",
    relatedStocks: ["GOOGL"],
    image: "/placeholder.svg?height=200&width=300&text=Google+Investigation",
  },
  {
    id: "6",
    title: "英伟达发布新一代AI芯片",
    summary:
      "英伟达发布了最新的H200 AI芯片，性能较上一代提升60%。新芯片将主要用于大型语言模型训练和推理，预计将进一步巩固英伟达在AI芯片市场的领导地位。",
    source: "科技新闻",
    time: "1天前",
    category: "产品发布",
    impact: "positive",
    relatedStocks: ["NVDA"],
    image: "/placeholder.svg?height=200&width=300&text=NVIDIA+H200",
  },
]

const categories = ["全部", "财报", "公司动态", "宏观经济", "科技", "监管", "产品发布"]

export default function Market() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")

  const filteredNews = mockNews.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "全部" || news.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "text-green-600 bg-green-100 dark:bg-green-900/20"
      case "negative":
        return "text-red-600 bg-red-100 dark:bg-red-900/20"
      default:
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="h-3 w-3" />
      case "negative":
        return <TrendingUp className="h-3 w-3 rotate-180" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:ml-64 p-4 lg:p-8 mobile-content lg:desktop-content">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">市场资讯</h1>
          <p className="text-muted-foreground">获取最新的市场动态和投资资讯</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜索新闻..."
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
          {filteredNews.map((news) => (
            <Card key={news.id} className="border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Image */}
                  <div className="md:col-span-1">
                    <img
                      src={news.image || "/placeholder.svg"}
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
                        <Badge className={`text-xs ${getImpactColor(news.impact)}`}>
                          {getImpactIcon(news.impact)}
                          <span className="ml-1">{news.category}</span>
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {news.time}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{news.title}</h3>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{news.summary}</p>

                    {/* Related Stocks */}
                    {news.relatedStocks.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">相关股票:</span>
                        <div className="flex gap-1">
                          {news.relatedStocks.map((stock) => (
                            <Badge
                              key={stock}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-red-600/10 hover:border-red-600 hover:text-red-600"
                            >
                              {stock}
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
            加载更多新闻
          </Button>
        </div>
      </div>
    </div>
  )
}
