const supabase = require('../db');
const axios = require('axios');
require('dotenv').config();

const fetchAndStoreNews = async () => {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
    const newsFeed = response.data.feed;

    if (!newsFeed) {
      return [];
    }

    const newsToInsert = newsFeed.map(item => ({
      title: item.title,
      url: item.url,
      time_published: item.time_published,
      authors: item.authors,
      summary: item.summary,
      banner_image: item.banner_image,
      source: item.source,
      category_within_source: item.category_within_source,
      source_domain: item.source_domain,
      topics: item.topics,
      overall_sentiment_score: item.overall_sentiment_score,
      overall_sentiment_label: item.overall_sentiment_label,
      ticker_sentiment: item.ticker_sentiment
    }));

    // Using upsert to avoid duplicates on the 'url' column
    const { data, error } = await supabase.from('news').upsert(newsToInsert, { onConflict: 'url' });

    if (error) {
      throw error;
    }

    // Fetch all news from the DB to return the latest list
    const { data: allNews, error: fetchError } = await supabase.from('news').select('*').order('time_published', { ascending: false });

    if (fetchError) {
        throw fetchError;
    }

    return allNews;
  } catch (error) {
    console.error('Error fetching or storing news:', error);
    throw new Error('Failed to fetch or store news.');
  }
};

module.exports = { fetchAndStoreNews };