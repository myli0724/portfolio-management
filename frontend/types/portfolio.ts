import { HistoryItem } from "./history";

export type PortfolioData = {
  tickerId: number,
  ticker: string,
  shares: number, // buying_vol
  currentPrice: number,
  totalValue: number,
  profit: number,
  profitRate: number,
  history: HistoryItem[]
}

export type PortfolioApiResponse = {
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