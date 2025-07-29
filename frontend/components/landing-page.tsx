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
              A professional portfolio management platform with real-time market tracking and intelligent investment insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Investing <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 rounded-xl bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Us?</h2>
          <p className="text-muted-foreground text-lg">Professional tools to power your investment success</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <TrendingUp className="h-8 w-8 text-red-500" />,
              title: "Real-time Data",
              description: "Millisecond-level Market Data Updates",
            },
            {
              icon: <BarChart3 className="h-8 w-8 text-red-500" />,
              title: "Smart Analytics",
              description: " AI-Powered Investment Recommendations",
            },
            {
              icon: <Shield className="h-8 w-8 text-red-500" />,
              title: "Security Assurance",
              description: "Bank-level Security Protection",
            },
            {
              icon: <Smartphone className="h-8 w-8 text-red-500" />,
              title: "Mobile-first Experience",
              description: "Manage Your Investments Anytime, Anywhere",
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Investment Journey?</h2>
          <p className="text-muted-foreground mb-8">Join tens of thousands of investors and enter the new era of intelligent investing</p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
