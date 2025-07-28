"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, TrendingUp, Shield, Smartphone, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent" />
        <div className="relative container mx-auto px-4 py-20">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Smart <span className="text-red-500">Investment</span>
              <br />
              Portfolio
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              专业的投资组合管理平台，实时追踪市场动态，智能分析投资机会
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  开始投资 <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 rounded-xl bg-transparent">
                了解更多
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">为什么选择我们</h2>
          <p className="text-muted-foreground text-lg">专业工具，助您投资成功</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <TrendingUp className="h-8 w-8 text-red-500" />,
              title: "实时数据",
              description: "毫秒级市场数据更新",
            },
            {
              icon: <BarChart3 className="h-8 w-8 text-red-500" />,
              title: "智能分析",
              description: "AI驱动的投资建议",
            },
            {
              icon: <Shield className="h-8 w-8 text-red-500" />,
              title: "安全保障",
              description: "银行级安全防护",
            },
            {
              icon: <Smartphone className="h-8 w-8 text-red-500" />,
              title: "移动优先",
              description: "随时随地管理投资",
            },
          ].map((feature, index) => (
            <Card key={index} className="border hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600/10 to-red-800/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">准备开始您的投资之旅？</h2>
          <p className="text-muted-foreground mb-8">加入数万投资者的行列，开启智能投资新时代</p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              立即开始
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
