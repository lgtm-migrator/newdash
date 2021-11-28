import * as assert from "assert";
import { falsey, stubTrue } from "./utils";
import inRange from "../src/inRange";
import each from "../src/each";
import map from "../src/map";

describe("inRange", () => {

  it("should work with an `end`", () => {
    assert.strictEqual(inRange(3, 5), true);
    assert.strictEqual(inRange(5, 5), false);
    assert.strictEqual(inRange(6, 5), false);
  });

  it("should work with a `start` and `end`", () => {
    assert.strictEqual(inRange(1, 1, 5), true);
    assert.strictEqual(inRange(3, 1, 5), true);
    assert.strictEqual(inRange(0, 1, 5), false);
    assert.strictEqual(inRange(5, 1, 5), false);
  });

  it("should treat falsey `start` as `0`", () => {
    each(falsey, (value, index) => {
      if (index) {
        assert.strictEqual(inRange(0, value), false);
        assert.strictEqual(inRange(0, value, 1), true);
      } else {
        assert.strictEqual(inRange(0), false);
      }
    });
  });

  it("should swap `start` and `end` when `start` > `end`", () => {
    assert.strictEqual(inRange(2, 5, 1), true);
    assert.strictEqual(inRange(-3, -2, -6), true);
  });

  it("should work with a floating point `n` value", () => {
    assert.strictEqual(inRange(0.5, 5), true);
    assert.strictEqual(inRange(1.2, 1, 5), true);
    assert.strictEqual(inRange(5.2, 5), false);
    assert.strictEqual(inRange(0.5, 1, 5), false);
  });

  it("should coerce arguments to finite numbers", () => {
    const actual = [
      inRange(0, "1"),
      inRange(0, "0", 1),
      inRange(0, 0, "1"),
      inRange(0, NaN, 1),
      inRange(-1, -1, NaN)
    ];

    assert.deepStrictEqual(actual, map(actual, stubTrue));
  });

});
