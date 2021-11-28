// @ts-nocheck
import * as assert from "assert";
import lodashStable from "lodash";
import isDate from "../src/isDate";
import { args, falsey, realm, slice, stubFalse, symbol } from "./utils";

describe("isDate", () => {
  it("should return `true` for dates", () => {
    assert.strictEqual(isDate(new Date), true);
  });

  it("should return `false` for non-dates", () => {
    const expected = lodashStable.map(falsey, stubFalse);

    const actual = lodashStable.map(falsey, (value, index) => index ? isDate(value) : isDate());

    assert.deepStrictEqual(actual, expected);

    assert.strictEqual(isDate(args), false);
    assert.strictEqual(isDate([1, 2, 3]), false);
    assert.strictEqual(isDate(true), false);
    assert.strictEqual(isDate(new Error), false);
    assert.strictEqual(isDate(_), false);
    assert.strictEqual(isDate(slice), false);
    assert.strictEqual(isDate({ "a": 1 }), false);
    assert.strictEqual(isDate(1), false);
    assert.strictEqual(isDate(/x/), false);
    assert.strictEqual(isDate("a"), false);
    assert.strictEqual(isDate(symbol), false);
  });

  it("should work with a date object from another realm", () => {
    if (realm.date) {
      assert.strictEqual(isDate(realm.date), true);
    }
  });
});
