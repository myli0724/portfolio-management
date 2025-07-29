import { HistoryItem } from "./history";

export interface PortfolioData {
  tickerId: number,
  ticker: string,
  shares: number, // buying_vol
  currentPrice: number,
  totalValue: number,
  profit: number,
  profitRate: number,
  history: HistoryItem[]
}

export interface PortfolioApiResponse {
  summary: {
    totalValue: number;
    totalProfit: number;
    totalChangeRate: number;
    todayChange: number;
    todayChangeRate: number;
    holdingCount: number;
  };
  holdings: PortfolioData[];
}