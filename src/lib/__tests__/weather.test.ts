import { describe, expect, it } from "vitest";
import { uvCategory, weatherTips } from "@/lib/weather-data";

const day = (over: Partial<Parameters<typeof weatherTips>[0]> = {}) => ({
  date: "2026-10-02",
  weatherCode: 1,
  maxTemp: 22,
  minTemp: 12,
  precipitationChance: 0,
  uvIndexMax: 1,
  ...over,
});

describe("weatherTips", () => {
  it("gives no tips on a mild, dry, low-UV day", () => {
    expect(weatherTips(day(), "celsius")).toEqual([]);
  });

  it("suggests an umbrella when rain is likely", () => {
    expect(weatherTips(day({ precipitationChance: 70 }), "celsius")[0].text).toMatch(/umbrella/);
  });

  it("works the same in Fahrenheit", () => {
    const hotC = weatherTips(day({ maxTemp: 33 }), "celsius").map((t) => t.emoji);
    const hotF = weatherTips(day({ maxTemp: 91.4, minTemp: 53.6 }), "fahrenheit").map((t) => t.emoji);
    expect(hotF).toEqual(hotC);
  });

  it("adds sun protection from UV 3 and handles a missing UV value", () => {
    expect(weatherTips(day({ uvIndexMax: 7 }), "celsius").some((t) => /sunscreen/.test(t.text))).toBe(true);
    expect(weatherTips(day({ uvIndexMax: null }), "celsius")).toEqual([]);
  });
});

describe("uvCategory", () => {
  it("uses the standard bands", () => {
    expect(uvCategory(2)).toBe("Low");
    expect(uvCategory(3)).toBe("Moderate");
    expect(uvCategory(6)).toBe("High");
    expect(uvCategory(8)).toBe("Very high");
    expect(uvCategory(11)).toBe("Extreme");
  });
});
