import * as assert from "assert";
import lodashStable from "../src";
import isArrayBuffer from "../src/isArrayBuffer";
import { args, arrayBuffer, falsey, realm, slice, stubFalse, symbol } from "./utils";

describe("isArrayBuffer", () => {
  it("should return `true` for array buffers", () => {
    if (ArrayBuffer) {
      assert.strictEqual(isArrayBuffer(arrayBuffer), true);
    }
  });

  it("should return `false` for non array buffers", () => {
    const expected = lodashStable.map(falsey, stubFalse);

    const actual = lodashStable.map(falsey, (value, index) => index ? isArrayBuffer(value) : isArrayBuffer());

    assert.deepStrictEqual(actual, expected);

    assert.strictEqual(isArrayBuffer(args), false);
    assert.strictEqual(isArrayBuffer([1]), false);
    assert.strictEqual(isArrayBuffer(true), false);
    assert.strictEqual(isArrayBuffer(new Date), false);
    assert.strictEqual(isArrayBuffer(new Error), false);
    assert.strictEqual(isArrayBuffer(_), false);
    assert.strictEqual(isArrayBuffer(slice), false);
    assert.strictEqual(isArrayBuffer({ "a": 1 }), false);
    assert.strictEqual(isArrayBuffer(1), false);
    assert.strictEqual(isArrayBuffer(/x/), false);
    assert.strictEqual(isArrayBuffer("a"), false);
    assert.strictEqual(isArrayBuffer(symbol), false);
  });

  it("should work with array buffers from another realm", () => {
    if (realm.arrayBuffer) {
      assert.strictEqual(isArrayBuffer(realm.arrayBuffer), true);
    }
  });
});
