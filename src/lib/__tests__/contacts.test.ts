import { describe, expect, it } from "vitest";
import { mailtoHref, normalizeContacts, smsHref, telHref } from "../contact-directory-storage";
import { formatDob, normalizeProfile } from "../emergency-info-card-storage";

describe("telHref", () => {
  it("keeps only digits and a leading plus", () => {
    expect(telHref("0412 345 678")).toBe("tel:0412345678");
    expect(telHref("+61 (2) 9999-0000")).toBe("tel:+61299990000");
    expect(telHref("000")).toBe("tel:000");
  });

  it("strips anything that could change the link", () => {
    expect(telHref("0412345678;javascript:alert(1)")).toBe("tel:04123456781");
    expect(telHref("1 2 3 +4")).toBe("tel:1234");
  });

  it("returns null without enough digits", () => {
    expect(telHref("")).toBeNull();
    expect(telHref("ask mum")).toBeNull();
  });
});

describe("smsHref", () => {
  it("offers text messages for mobiles only", () => {
    expect(smsHref("0412 345 678")).toBe("sms:0412345678");
    expect(smsHref("+61 412 345 678")).toBe("sms:+61412345678");
    expect(smsHref("02 9999 0000")).toBeNull();
  });
});

describe("mailtoHref", () => {
  it("accepts a plain address", () => {
    expect(mailtoHref(" sam@example.com ")).toBe("mailto:sam@example.com");
  });

  it("rejects anything that isn't a single address", () => {
    expect(mailtoHref("sam")).toBeNull();
    expect(mailtoHref("a@b.com?subject=x")).toBe("mailto:a@b.com%3Fsubject%3Dx");
    expect(mailtoHref("a@b.com, c@d.com")).toBeNull();
    expect(mailtoHref("<a@b.com>")).toBeNull();
  });
});

describe("normalizeContacts", () => {
  it("keeps saved contacts and fills missing fields", () => {
    const [c] = normalizeContacts([{ id: "1", name: "Dr Lee", category: "Therapists", phone: "0400000000" }]);
    expect(c).toEqual({
      id: "1",
      name: "Dr Lee",
      category: "Therapists",
      organisation: "",
      phone: "0400000000",
      email: "",
      notes: "",
    });
  });

  it("survives junk", () => {
    expect(normalizeContacts("x")).toEqual([]);
    expect(normalizeContacts([null])).toEqual([]);
  });
});

describe("emergency card profile", () => {
  it("loads an old card and adds updatedAt", () => {
    const p = normalizeProfile({ name: "Sam", allergies: "Penicillin", extra: 5 });
    expect(p.name).toBe("Sam");
    expect(p.allergies).toBe("Penicillin");
    expect(p.updatedAt).toBe("");
    expect("extra" in p).toBe(false);
  });

  it("formats the date of birth in Australian order", () => {
    expect(formatDob("2001-03-09")).toBe("09/03/2001");
    expect(formatDob("March 2001")).toBe("March 2001");
  });
});
