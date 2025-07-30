"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Stock } from "@/types/stock"
import { tradeStock } from "@/services/stocksService"

interface TradingModalProps {
  isOpen: boolean
  onClose: () => void
  stockId: number
  stockName: string
  stockPrice: number
  stockChange: number
  stockChangeRate: number
  type: "buy" | "sell"
}

export default function TradingModal({ isOpen, onClose, stockId, stockName, stockPrice, stockChange, stockChangeRate, type }: TradingModalProps) {
  const [quantity, setQuantity] = useState("")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [limitPrice, setLimitPrice] = useState("")
  const [error, setError] = useState("");

  const totalValue = Number(quantity) * stockPrice || 0

  const handleSubmit = async () => {
    try {
      const res = await tradeStock(stockId, type, Number(quantity), stockPrice);
      console.log("✅ Trade Success:", res);
      setQuantity("");
      // setSuccess(true)
      setTimeout(() => {
        // setSuccess(false)
        onClose()
      }, 1500)
    } catch (err: any) {
      console.error("❌ Trade Error:", err);
      setError("Trade failed, please try again.");
    } 
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "buy" ? "Buy" : "Sell"} {stockName}
            <Badge variant={type === "buy" ? "default" : "destructive"} className="ml-2">
              {type === "buy" ? "Buy" : "Sell"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stock Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{stockName}</h3>
                {/* <p className="text-sm text-muted-foreground">{stock.name}</p> */}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">${stockPrice}</p>
                <div className="flex items-center gap-1">
                  {stockChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={stockChange > 0 ? "text-green-600" : "text-red-600"}>
                    {stockChangeRate > 0 ? "+" : ""}
                    {stockChangeRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Type */}
          <div>
            <Label className="text-foreground mb-2 block">Order Type</Label>
            <div className="flex gap-2">
              <Button
                variant={orderType === "market" ? "default" : "outline"}
                onClick={() => setOrderType("market")}
                className="flex-1"
              >
                Market Order
              </Button>
              <Button
                variant={orderType === "limit" ? "default" : "outline"}
                onClick={() => setOrderType("limit")}
                className="flex-1"
              >
                Limit Order
              </Button>
            </div>
          </div>

          {/* Limit Price */}
          {orderType === "limit" && (
            <div>
              <Label htmlFor="limitPrice" className="text-foreground">
                Limit Price
              </Label>
              <Input
                id="limitPrice"
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="Enter Limit Price"
              />
            </div>
          )}

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity" className="text-foreground">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter Number of Shares"
            />
          </div>

          {/* Total Value */}
          {Number(quantity) > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estimated Total Value</span>
                <span className="text-xl font-bold text-foreground">${totalValue.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!quantity}
              className={`flex-1 text-white ${type === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              Confirm{type === "buy" ? " Buy" : " Sell"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
