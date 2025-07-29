import { CURRENT_USER_ID } from "@/lib/constants"
import { HistoryItem } from "@/types/history";

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

const API_BASE = "http://localhost:3001";

export async function fetchPortfolio(): Promise<PortfolioData[]> {
    const url = `${API_BASE}/user/${CURRENT_USER_ID}/holdings-with-history`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed getting portfolio data...");
    }

    const json = await res.json();
    return json.data;
}
