import * as assert from "assert";
import lodashStable from "../src";
import sortedUniq from "../src/sortedUniq";

describe("sortedUniq", () => {
  it("should return unique values of a sorted array", () => {
    const expected = [1, 2, 3];

    lodashStable.each([[1, 2, 3], [1, 1, 2, 2, 3], [1, 2, 3, 3, 3, 3, 3]], (array) => {
      assert.deepStrictEqual(sortedUniq(array), expected);
    });
  });
});
