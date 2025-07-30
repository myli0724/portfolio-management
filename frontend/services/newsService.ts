const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image?: string;
  source: string;
  category_within_source?: string;
  source_domain?: string;
  topics?: any[];
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment?: any[];
}

export const newsService = {
  async getNews(): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${API_BASE}/news`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch news:', error);
      throw error;
    }
  }
};