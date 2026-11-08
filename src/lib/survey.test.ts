import { describe, it, expect } from "vitest";
import { positiveShare } from "./survey";

describe("positiveShare", () => {
  it("counts 4 and 5 as positive", () => expect(positiveShare([5, 4, 3, 2])).toBe(0.5));
  it("ignores unanswered", () => expect(positiveShare([4, null])).toBe(1));
  it("empty is zero", () => expect(positiveShare([])).toBe(0));
});
