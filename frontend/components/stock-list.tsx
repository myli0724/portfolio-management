"use client"

import { Button } from "@/components/ui/button"
import { Star, TrendingUp, TrendingDown } from "lucide-react"

interface Stock {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
  data: number[]
}

interface StockListProps {
  stocks: Stock[]
  onSelectStock: (stock: Stock) => void
  selectedStock: Stock
  watchlist: string[]
  onToggleWatchlist: (stockId: string) => void
  onTrade: (stock: Stock, type: "buy" | "sell") => void
}

export default function StockList({
  stocks,
  onSelectStock,
  selectedStock,
  watchlist,
  onToggleWatchlist,
  onTrade,
}: StockListProps) {
  return (
    <div className="space-y-3">
      {stocks.map((stock) => (
        <div
          key={stock.id}
          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
            selectedStock.id === stock.id ? "border-red-600 bg-red-600/10" : "border-border bg-muted/20"
          }`}
          onClick={() => onSelectStock(stock)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div>
                <h3 className="font-semibold text-foreground">{stock.symbol}</h3>
                <p className="text-xs text-muted-foreground truncate max-w-24">{stock.name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${
                  watchlist.includes(stock.id)
                    ? "text-yellow-500 hover:text-yellow-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleWatchlist(stock.id)
                }}
              >
                <Star className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">${stock.price}</p>
              <div className="flex items-center gap-1">
                {stock.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs ${stock.change > 0 ? "text-green-600" : "text-red-600"}`}>
                  {stock.changePercent > 0 ? "+" : ""}
                  {stock.changePercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-8 mb-2">
            <svg className="w-full h-full" viewBox="0 0 100 20">
              <polyline
                fill="none"
                stroke={stock.change > 0 ? "#16a34a" : "#dc2626"}
                strokeWidth="1"
                points={stock.data
                  .map((value, index) => {
                    const x = (index / (stock.data.length - 1)) * 100
                    const minValue = Math.min(...stock.data)
                    const maxValue = Math.max(...stock.data)
                    const range = maxValue - minValue || 1
                    const y = 20 - ((value - minValue) / range) * 20
                    return `${x},${y}`
                  })
                  .join(" ")}
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Volume: {stock.volume}</span>
            <span>Market Value: {stock.marketCap}</span>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white flex-1 h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onTrade(stock, "buy")
              }}
            >
              Buy
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600/10 flex-1 h-7 text-xs bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                onTrade(stock, "sell")
              }}
            >
              Sell
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
