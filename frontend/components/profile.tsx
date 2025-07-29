"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, Calendar, TrendingUp, DollarSign, Award, Settings, Bell } from "lucide-react"
import Navigation from "@/components/navigation"

// Mock user data
const userData = {
  name: "Michael",
  email: "wassupmichael@example.com",
  phone: "+86 138 0013 8000",
  joinDate: "2023/3/15",
  avatar: "/placeholder.svg?height=100&width=100&text=ZS",
  level: "VIP",
  totalInvestment: 125430.5,
  totalGain: 8234.2,
  totalGainPercent: 7.02,
  winRate: 68.5,
  totalTrades: 156,
  achievements: [
    { 
    id: 1,
    name: "New Investor",
    description: "Complete your first investment",
    earned: true
  },
  { 
    id: 2,
    name: "Steady Investor",
    description: "Maintain 30 consecutive days of profit",
    earned: true
  },
  { 
    id: 3,
    name: "Investment Pro",
    description: "Achieve a total return over 10%",
    earned: false
  },
  { 
    id: 4,
    name: "Trading Expert",
    description: "Complete 100 trades",
    earned: true
  },
  ],
  recentTrades: [
    { id: 1, symbol: "AAPL", type: "buy", shares: 10, price: 175.43, date: "2024-01-15", profit: 234.5 },
    { id: 2, symbol: "TSLA", type: "sell", shares: 5, price: 248.5, date: "2024-01-14", profit: -125.3 },
    { id: 3, symbol: "MSFT", type: "buy", shares: 8, price: 378.85, date: "2024-01-13", profit: 156.8 },
  ],
}

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:ml-64 p-4 lg:p-8 mobile-content lg:desktop-content">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account information and investment records</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="border mb-6">
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-red-600 text-white text-2xl">{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-foreground mb-1">{userData.name}</h2>
                <Badge className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white mb-4">
                  {userData.level}
                </Badge>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{userData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Join in on {userData.joinDate}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievement Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {userData.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                        achievement.earned ? "border-yellow-600 bg-yellow-600/10" : "border-border bg-muted/30"
                      }`}
                    >
                      <Award
                        className={`h-6 w-6 mx-auto mb-2 ${achievement.earned ? "text-yellow-500" : "text-muted-foreground"}`}
                      />
                      <h4
                        className={`text-sm font-semibold mb-1 ${achievement.earned ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Investment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-muted-foreground text-sm">Total Amount Invested</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">${userData.totalInvestment.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card className="border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-muted-foreground text-sm">Total Return</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">+${userData.totalGain.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+{userData.totalGainPercent}%</p>
                </CardContent>
              </Card>

              <Card className="border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="text-muted-foreground text-sm">Win Rate = Percentage of trades closed with a profit</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{userData.winRate}%</p>
                </CardContent>
              </Card>

              <Card className="border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-muted-foreground text-sm">Total Trades</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{userData.totalTrades}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Trades */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-foreground">Most Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userData.recentTrades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={trade.type === "buy" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                            {trade.type === "buy" ? "Buy" : "Sell"}
                        </Badge>
                        <div>
                          <p className="font-semibold text-foreground">{trade.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {trade.shares} Shares @ ${trade.price}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${trade.profit > 0 ? "text-green-600" : "text-red-600"}`}>
                          {trade.profit > 0 ? "+" : ""}${trade.profit}
                        </p>
                        <p className="text-sm text-muted-foreground">{trade.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Trades
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
