import { HistoryItem } from "./history";

export type Stock = {
  id: number
  tickerName: string
  recentOpenPrice: number
  recentClosePrice: number
  date: string
  marketValue: number
  volume: number
  high: number
  low: number
  history: HistoryItem[]
}

export function transformStockData(raw: any, tickerId: number): Stock {
  return {
    id: tickerId,
    tickerName: raw.ticker_name,
    recentOpenPrice: raw.recent_open_price,
    recentClosePrice: raw.recent_close_price,
    date: raw.date,
    marketValue: raw.market_value,
    volume: raw.volume,
    high: raw.high,
    low: raw.low,
    history: raw.history
  }
}
