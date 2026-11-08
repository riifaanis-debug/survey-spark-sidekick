import { describe, it, expect } from "vitest";
import { hypothesisResult } from "./survey";

describe("hypothesisResult", () => {
  it("11 of 15 meets the target", () => expect(hypothesisResult(11, 15).met).toBe(true));
  it("10 of 15 does not meet the target", () => expect(hypothesisResult(10, 15).met).toBe(false));
  it("no responses does not meet the target", () => expect(hypothesisResult(0, 0).met).toBe(false));
});
