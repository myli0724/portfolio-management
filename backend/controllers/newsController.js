const newsService = require('../services/newsService');

exports.getNews = async (req, res) => {
  try {
    const news = await newsService.fetchAndStoreNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};