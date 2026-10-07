import { describe, expect, it } from "vitest";
import {
  cleanIsbn,
  isValidIsbn10,
  isValidIsbn13,
  toIsbn13,
} from "./isbn";

describe("ISBN utilities", () => {
  it("cleans punctuation and spaces", () => {
    expect(cleanIsbn("978-0-13-468599-1")).toBe("9780134685991");
  });

  it("validates known ISBN-13 and rejects a bad check digit", () => {
    expect(isValidIsbn13("9780134685991")).toBe(true);
    expect(isValidIsbn13("9780134685992")).toBe(false);
  });

  it("validates ISBN-10", () => {
    expect(isValidIsbn10("0134685997")).toBe(true);
    expect(isValidIsbn10("0134685998")).toBe(false);
  });

  it("converts ISBN-10 to ISBN-13", () => {
    expect(toIsbn13("0134685997")).toBe("9780134685991");
  });
});
