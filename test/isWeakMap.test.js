import * as assert from "assert";
import lodashStable from "../src";
import isWeakMap from "../src/isWeakMap";
import { args, falsey, map, realm, slice, stubFalse, symbol, weakMap } from "./utils";

describe("isWeakMap", () => {
  it("should return `true` for weak maps", () => {
    if (WeakMap) {
      assert.strictEqual(isWeakMap(weakMap), true);
    }
  });

  it("should return `false` for non weak maps", () => {
    const expected = lodashStable.map(falsey, stubFalse);

    const actual = lodashStable.map(falsey, (value, index) => index ? isWeakMap(value) : isWeakMap());

    assert.deepStrictEqual(actual, expected);

    assert.strictEqual(isWeakMap(args), false);
    assert.strictEqual(isWeakMap([1, 2, 3]), false);
    assert.strictEqual(isWeakMap(true), false);
    assert.strictEqual(isWeakMap(new Date), false);
    assert.strictEqual(isWeakMap(new Error), false);
    assert.strictEqual(isWeakMap(_), false);
    assert.strictEqual(isWeakMap(slice), false);
    assert.strictEqual(isWeakMap({ "a": 1 }), false);
    assert.strictEqual(isWeakMap(map), false);
    assert.strictEqual(isWeakMap(1), false);
    assert.strictEqual(isWeakMap(/x/), false);
    assert.strictEqual(isWeakMap("a"), false);
    assert.strictEqual(isWeakMap(symbol), false);
  });

  it("should work for objects with a non-function `constructor` (test in IE 11)", () => {
    const values = [false, true],
      expected = lodashStable.map(values, stubFalse);

    const actual = lodashStable.map(values, (value) => isWeakMap({ "constructor": value }));

    assert.deepStrictEqual(actual, expected);
  });

  it("should work with weak maps from another realm", () => {
    if (realm.weakMap) {
      assert.strictEqual(isWeakMap(realm.weakMap), true);
    }
  });
});
