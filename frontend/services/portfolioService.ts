import { CURRENT_USER_ID } from "@/lib/constants"
import { PortfolioApiResponse } from "@/types/portfolio";

const API_BASE = "http://localhost:3001";

export async function fetchPortfolio(): Promise<PortfolioApiResponse> {
    const url = `${API_BASE}/user/${CURRENT_USER_ID}/portfolio`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed getting portfolio data...");
    }

    const json = await res.json();
    return json.data;
}
