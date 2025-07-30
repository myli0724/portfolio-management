import { Stock, transformStockData } from "@/types/stock";
import { CURRENT_USER_ID } from "@/lib/constants"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

export async function fetchStockById(tickerId: number): Promise<Stock> {
    const url = `${API_BASE}/stocks/${tickerId}/details`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Failed getting stock ${tickerId}...`);
    }

    const json = await res.json();
    return transformStockData(json.data, tickerId);
}

export async function fetchStockByKeyWord(tickerName: string): Promise<Stock> {
    const url = `${API_BASE}/stocks/search?name=${tickerName}`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Failed getting stock ${tickerName}...`);
    }

    const json = await res.json();
    return transformStockData(json.data, json.data.id);
}

export async function tradeStock(tickerId: number, type: "buy" | "sell", quantity: number, price: number) {
  const endpoint = `${API_BASE}/stocks/${CURRENT_USER_ID}/${type}`

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tickerId,
      quantity,
      price,
    }),
  })

  if (!res.ok) {
    const errMsg = await res.text()
    throw new Error(`Trade failed: ${errMsg}`)
  }

  return res.json()
}