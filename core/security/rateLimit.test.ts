import { describe, it, expect } from "vitest";
import { rateLimit } from "./rateLimit";

describe("rateLimit", () => {
  it("blocks after tokens exhausted", () => {
    const key = "k1";
    for (let i = 0; i < 5; i++) expect(rateLimit(key, { capacity: 5, refillPerSec: 0 }).ok).toBe(true);
    expect(rateLimit(key, { capacity: 5, refillPerSec: 0 }).ok).toBe(false);
  });
});
