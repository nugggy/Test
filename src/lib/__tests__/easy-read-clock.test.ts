import { describe, expect, it } from "vitest";
import { partOfDay, spokenTime, timeInWords } from "@/lib/easy-read-clock-words";

describe("timeInWords", () => {
  it("says exact five-minute marks plainly", () => {
    expect(timeInWords(15, 0)).toBe("3 o'clock");
    expect(timeInWords(15, 15)).toBe("Quarter past 3");
    expect(timeInWords(15, 30)).toBe("Half past 3");
    expect(timeInWords(15, 45)).toBe("Quarter to 4");
    expect(timeInWords(15, 40)).toBe("20 to 4");
    expect(timeInWords(9, 5)).toBe("5 past 9");
  });

  it("rounds to the nearest five minutes and says 'About'", () => {
    expect(timeInWords(15, 8)).toBe("About 10 past 3");
    expect(timeInWords(15, 2)).toBe("About 3 o'clock");
    expect(timeInWords(15, 58)).toBe("About 4 o'clock");
  });

  it("uses midnight and midday", () => {
    expect(timeInWords(0, 0)).toBe("Midnight");
    expect(timeInWords(12, 0)).toBe("Midday");
    expect(timeInWords(11, 58)).toBe("About midday");
    expect(timeInWords(23, 58)).toBe("About midnight");
    expect(timeInWords(0, 30)).toBe("Half past midnight");
    expect(timeInWords(12, 45)).toBe("Quarter to 1");
  });
});

describe("partOfDay", () => {
  it("splits the day into everyday parts", () => {
    expect(partOfDay(4).id).toBe("night");
    expect(partOfDay(5).id).toBe("morning");
    expect(partOfDay(11).id).toBe("morning");
    expect(partOfDay(12).id).toBe("afternoon");
    expect(partOfDay(17).id).toBe("evening");
    expect(partOfDay(21).id).toBe("night");
  });
});

describe("spokenTime", () => {
  it("adds the part of the day", () => {
    expect(spokenTime(15, 15)).toBe("It's quarter past 3 in the afternoon.");
    expect(spokenTime(7, 30)).toBe("It's half past 7 in the morning.");
    expect(spokenTime(22, 0)).toBe("It's 10 o'clock at night.");
    expect(spokenTime(12, 0)).toBe("It's midday.");
  });
});
