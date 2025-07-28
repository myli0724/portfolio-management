"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Stock {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface TradingModalProps {
  isOpen: boolean
  onClose: () => void
  stock: Stock
  type: "buy" | "sell"
}

export default function TradingModal({ isOpen, onClose, stock, type }: TradingModalProps) {
  const [quantity, setQuantity] = useState("")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [limitPrice, setLimitPrice] = useState("")

  const totalValue = Number.parseFloat(quantity) * stock.price || 0

  const handleSubmit = () => {
    // Here you would handle the actual trading logic
    console.log("Trading:", { stock, type, quantity, orderType, limitPrice })
    onClose()
    setQuantity("")
    setLimitPrice("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "buy" ? "买入" : "卖出"} {stock.symbol}
            <Badge variant={type === "buy" ? "default" : "destructive"} className="ml-2">
              {type === "buy" ? "买入" : "卖出"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stock Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{stock.symbol}</h3>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">${stock.price}</p>
                <div className="flex items-center gap-1">
                  {stock.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={stock.change > 0 ? "text-green-600" : "text-red-600"}>
                    {stock.changePercent > 0 ? "+" : ""}
                    {stock.changePercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Type */}
          <div>
            <Label className="text-foreground mb-2 block">订单类型</Label>
            <div className="flex gap-2">
              <Button
                variant={orderType === "market" ? "default" : "outline"}
                onClick={() => setOrderType("market")}
                className="flex-1"
              >
                市价单
              </Button>
              <Button
                variant={orderType === "limit" ? "default" : "outline"}
                onClick={() => setOrderType("limit")}
                className="flex-1"
              >
                限价单
              </Button>
            </div>
          </div>

          {/* Limit Price */}
          {orderType === "limit" && (
            <div>
              <Label htmlFor="limitPrice" className="text-foreground">
                限价价格
              </Label>
              <Input
                id="limitPrice"
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="输入限价价格"
              />
            </div>
          )}

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity" className="text-foreground">
              数量
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="输入股票数量"
            />
          </div>

          {/* Total Value */}
          {quantity && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">预估总价值</span>
                <span className="text-xl font-bold text-foreground">${totalValue.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!quantity}
              className={`flex-1 ${type === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              确认{type === "buy" ? "买入" : "卖出"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
