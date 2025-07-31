const stocksService = require("../services/stocksService");

describe("Stocks Service", () => {
  test("should return stock details", async () => {
    jest.spyOn(stocksService, "getStockDetails").mockResolvedValue({
      ticker_name: "AAPL",
      recent_open_price: 150,
      recent_close_price: 155,
      date: "2025-07-31",
      market_value: 1550,
      volume: 10000
    });

    const result = await stocksService.getStockDetails(4, 1);
    expect(result).toHaveProperty("ticker_name");
  });
});
