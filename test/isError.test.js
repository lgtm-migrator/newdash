import * as assert from "assert";
import lodashStable from "lodash";

import {
  errors,
  stubTrue,
  CustomError,
  falsey,
  stubFalse,
  args,
  slice,
  symbol,
  realm
} from "./utils";

import isError from "../src/isError";

describe("isError", () => {
  it("should return `true` for error objects", () => {
    const expected = lodashStable.map(errors, stubTrue);

    const actual = lodashStable.map(errors, (error) => isError(error) === true);

    assert.deepStrictEqual(actual, expected);
  });

  it("should return `true` for subclassed values", () => {
    assert.strictEqual(isError(new CustomError("x")), true);
  });

  it("should return `false` for non error objects", () => {
    const expected = lodashStable.map(falsey, stubFalse);

    const actual = lodashStable.map(falsey, (value, index) => index ? isError(value) : isError());

    assert.deepStrictEqual(actual, expected);

    assert.strictEqual(isError(args), false);
    assert.strictEqual(isError([1, 2, 3]), false);
    assert.strictEqual(isError(true), false);
    assert.strictEqual(isError(new Date), false);
    assert.strictEqual(isError(_), false);
    assert.strictEqual(isError(slice), false);
    assert.strictEqual(isError({ "a": 1 }), false);
    assert.strictEqual(isError(1), false);
    assert.strictEqual(isError(/x/), false);
    assert.strictEqual(isError("a"), false);
    assert.strictEqual(isError(symbol), false);
  });

  it("should return `false` for plain objects", () => {
    assert.strictEqual(isError({ "name": "Error", "message": "" }), false);
  });

  it("should work with an error object from another realm", () => {
    if (realm.errors) {
      const expected = lodashStable.map(realm.errors, stubTrue);

      const actual = lodashStable.map(realm.errors, (error) => isError(error) === true);

      assert.deepStrictEqual(actual, expected);
    }
  });
});
