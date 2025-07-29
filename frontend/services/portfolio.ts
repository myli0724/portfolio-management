import { CURRENT_USER_ID } from "@/lib/constants"

export interface PortfolioData {
  tickerId: number,
  ticker: string,
  shares: number, // buying_vol
  currentPrice: number,
  totalValue: number,
  profit: number,
  profitRate: number,
  history: number[]
}

const API_BASE = "http://localhost:3001";

export async function fetchPortfolio(): Promise<PortfolioData[]> {
    const url = `${API_BASE}/user/${CURRENT_USER_ID}/holdings-with-history`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed getting portfolio data...");
    }

    return res.json();
}
