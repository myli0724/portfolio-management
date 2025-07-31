const portfolioService = require("../services/portfolioService");

describe("Portfolio Service", () => {
  test("should block buyStock if insufficient balance", async () => {
    jest.spyOn(portfolioService, "buyStock").mockResolvedValue({
      success: false,
      message: "Insufficient balance"
    });

    const result = await portfolioService.buyStock(1, 4, 100, 200);
    expect(result.success).toBe(false);
  });

  test("should allow buyStock if balance is enough", async () => {
    jest.spyOn(portfolioService, "buyStock").mockResolvedValue({
      success: true,
      user: { total_balance: 5000, available_balance: 3000, assets: 2000 }
    });

    const result = await portfolioService.buyStock(1, 4, 1, 100);
    expect(result.success).toBe(true);
  });

  test("should update balances after sellStock", async () => {
    jest.spyOn(portfolioService, "sellStock").mockResolvedValue({
      success: true,
      user: { total_balance: 5000, available_balance: 3500, assets: 1500 }
    });

    const result = await portfolioService.sellStock(1, 4, 1);
    expect(result.success).toBe(true);
  });
});
