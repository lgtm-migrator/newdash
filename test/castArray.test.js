import * as assert from "assert";
import lodashStable from "../src";
import castArray from "../src/castArray";
import { falsey } from "./utils";

describe("castArray", () => {
  it("should wrap non-array items in an array", () => {
    const values = falsey.concat(true, 1, "a", { "a": 1 }),
      expected = lodashStable.map(values, (value) => [value]),
      actual = lodashStable.map(values, castArray);

    assert.deepStrictEqual(actual, expected);
  });

  it("should return array values by reference", () => {
    const array = [1];
    assert.strictEqual(castArray(array), array);
  });

  it("should return an empty array when no arguments are given", () => {
    assert.deepStrictEqual(castArray(), []);
  });
});
