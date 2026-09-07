import { describe, expect, it } from "vitest";
import { parseNumberList } from "../lib/number-input";

describe("parseNumberList", () => {
  it("把空输入解析为空数组，而不是 0", () => {
    expect(parseNumberList("")).toEqual([]);
    expect(parseNumberList("   ")).toEqual([]);
  });

  it("支持中文逗号、英文逗号和空格分隔", () => {
    expect(parseNumberList("1，2, 3 4")).toEqual([1, 2, 3, 4]);
  });

  it("会过滤不在范围内的号码", () => {
    expect(parseNumberList("0,1,33,34", 1, 33)).toEqual([1, 33]);
  });
});
