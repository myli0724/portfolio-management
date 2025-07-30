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
import { useI18n } from "./i18n-provider"

interface TradingModalProps {
  isOpen: boolean
  onClose: () => void
  stockId: number
  stockName: string
  stockPrice: number
  stockChange: number
  stockChangeRate: number
  userBalance: number
  shares: number
  type: "buy" | "sell"
  onTradeComplete: (newData: any) => void
}

export default function TradingModal({ isOpen, onClose, stockId, stockName, stockPrice, stockChange, stockChangeRate, userBalance, shares, type, onTradeComplete }: TradingModalProps) {
  const { t } = useI18n();
  const [quantity, setQuantity] = useState("")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [limitPrice, setLimitPrice] = useState("")
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalValue = Number(quantity) * stockPrice || 0;
  const insufficientFunds = type === "buy" && totalValue > userBalance;
  const isSellOverHoldings = type === "sell" && Number(quantity) > shares;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await tradeStock(stockId, type, Number(quantity), stockPrice);
      onTradeComplete(res.result.user);
      setSuccess(true);
      setQuantity("");
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("❌ Trade Error:", err);

      setError("Trade failed, please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    setQuantity("");
    setLimitPrice("");
    setError("");
    setSuccess(false);
    setLoading(false);
    setOrderType("market");
    onClose();
  }

  // const handleSubmit = async () => {
  //   try {
  //     const res = await tradeStock(stockId, type, Number(quantity), stockPrice);
  //     console.log("✅ Trade Success:", res);
  //     setQuantity("");
  //     // setSuccess(true)
  //     setTimeout(() => {
  //       // setSuccess(false)
  //       onClose()
  //     }, 1500)
  //   } catch (err: any) {
  //     console.error("❌ Trade Error:", err);
  //     setError("Trade failed, please try again.");
  //   } 
  // }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "buy" ? t("portfolio.buy") : t("portfolio.sell")} {stockName}
            <Badge variant={type === "buy" ? "default" : "destructive"} className="ml-2">
              {type === "buy" ? t("portfolio.buy") : t("portfolio.sell")}
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
            <Label className="text-foreground mb-2 block">{t("trading.orderType")}</Label>
            <div className="flex gap-2">
              <Button
                variant={orderType === "market" ? "default" : "outline"}
                onClick={() => setOrderType("market")}
                className="flex-1"
              >
                {t("trading.marketOrder")}
              </Button>
              <Button
                variant={orderType === "limit" ? "default" : "outline"}
                onClick={() => setOrderType("limit")}
                className="flex-1"
              >
                {t("trading.limitOrder")}
              </Button>
            </div>
          </div>

          {/* Limit Price */}
          {orderType === "limit" && (
            <div>
              <Label htmlFor="limitPrice" className="text-foreground">
                {t("trading.limitPrice")}
              </Label>
              <Input
                id="limitPrice"
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder={t("trading.enterLimitPrice")}
              />
            </div>
          )}

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity" className="text-foreground">
              {t("trading.quantity")}
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={t("trading.enterShares")}
            />
          </div>

          {/* Total Value */}
          {Number(quantity) > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t("trading.estimatedTotal")}</span>
                <span className="text-xl font-bold text-foreground">${totalValue.toFixed(2)}</span>
              </div>
            </div>
          )}

          {success && <p className="text-green-600 text-sm">Trade finished!</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {insufficientFunds && (
              <p className="text-sm text-red-600 mt-1">Insufficient funds. Your balance is ${userBalance.toFixed(2)}</p>
          )}
          {isSellOverHoldings && (
              <p className="text-sm text-red-600 mt-1">Cannot sell {quantity} shares of {stockName}. You only own {shares} shares.</p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
              {t("trading.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!quantity || loading || insufficientFunds || isSellOverHoldings}
              className={`flex-1 text-white ${
                type === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Processing..." : `Confirm ${type === "buy" ? "Buy" : "Sell"}`}
            </Button>


            {/* <Button
              onClick={handleSubmit}
              disabled={!quantity}
              className={`flex-1 text-white ${type === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            >

              {t("trading.confirm")}{type === "buy" ? ` ${t("portfolio.buy")}` : ` ${t("portfolio.sell")}`}
            </Button>
=======
              Confirm{type === "buy" ? " Buy" : " Sell"}
            </Button> */}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
