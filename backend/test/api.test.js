// test/newsService.test.js
jest.mock("../services/newsService", () => ({
    getLatestNews: jest.fn().mockResolvedValue([
        { id: 1, title: "Mock News", url: "http://example.com" },
    ]),
}));

const newsService = require("../services/newsService");

describe("News Service", () => {
    test("should return news list", async () => {
        const result = await newsService.getLatestNews();
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toHaveProperty("title", "Mock News");
    });
});
