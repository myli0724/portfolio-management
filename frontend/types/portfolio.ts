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

export type Balance = {
    totalBalance: number,
    availableBalance: number,
    assets: number
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
  user: Balance
}

export function transformBalanceData(raw: any): Balance {
  return {
    totalBalance: raw.total_balance,
    availableBalance: raw.available_balance,
    assets: raw.assets
  }
}