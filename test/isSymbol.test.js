import * as assert from "assert";
import lodashStable from "../src";
import isSymbol from "../src/isSymbol";
import { args, falsey, realm, slice, stubFalse, symbol } from "./utils";

describe("isSymbol", () => {
  it("should return `true` for symbols", () => {
    if (Symbol) {
      assert.strictEqual(isSymbol(symbol), true);
      assert.strictEqual(isSymbol(Object(symbol)), true);
    }
  });

  it("should return `false` for non-symbols", () => {
    const expected = lodashStable.map(falsey, stubFalse);

    const actual = lodashStable.map(falsey, (value, index) => index ? isSymbol(value) : isSymbol());

    assert.deepStrictEqual(actual, expected);

    assert.strictEqual(isSymbol(args), false);
    assert.strictEqual(isSymbol([1, 2, 3]), false);
    assert.strictEqual(isSymbol(true), false);
    assert.strictEqual(isSymbol(new Date), false);
    assert.strictEqual(isSymbol(new Error), false);
    assert.strictEqual(isSymbol(_), false);
    assert.strictEqual(isSymbol(slice), false);
    assert.strictEqual(isSymbol({ "0": 1, "length": 1 }), false);
    assert.strictEqual(isSymbol(1), false);
    assert.strictEqual(isSymbol(/x/), false);
    assert.strictEqual(isSymbol("a"), false);
  });

  it("should work with symbols from another realm", () => {
    if (Symbol && realm.symbol) {
      assert.strictEqual(isSymbol(realm.symbol), true);
    }
  });
});
