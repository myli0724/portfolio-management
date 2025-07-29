import { Stock, transformStockData } from "@/types/stock";

const API_BASE = "http://localhost:3001";

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
