import * as assert from "assert";
import keyBy from "../src/keyBy";
import map from "../src/map";
import constant from "../src/constant";

describe("keyBy", () => {

  const array = [
    { "dir": "left", "code": 97 },
    { "dir": "right", "code": 100 }
  ];

  it("should transform keys by `iteratee`", () => {
    const expected = { "a": { "dir": "left", "code": 97 }, "d": { "dir": "right", "code": 100 } };

    const actual = keyBy(array, (object) => String.fromCharCode(object.code));

    assert.deepStrictEqual(actual, expected);
  });

  it("should use `_.identity` when `iteratee` is nullish", () => {
    const array = [4, 6, 6],
      values = [, null, undefined],
      expected = map(values, constant({ "4": 4, "6": 6 }));

    const actual = map(values, (value, index) => index ? keyBy(array, value) : keyBy(array));

    assert.deepStrictEqual(actual, expected);
  });

  it("should work with `_.property` shorthands", () => {
    const expected = { "left": { "dir": "left", "code": 97 }, "right": { "dir": "right", "code": 100 } },
      actual = keyBy(array, "dir");

    assert.deepStrictEqual(actual, expected);
  });

  it("should only add values to own, not inherited, properties", () => {
    const actual = keyBy([6.1, 4.2, 6.3], (n) => Math.floor(n) > 4 ? "hasOwnProperty" : "constructor");

    assert.deepStrictEqual(actual.constructor, 4.2);
    assert.deepStrictEqual(actual.hasOwnProperty, 6.3);
  });

  it("should work with a number for `iteratee`", () => {
    const array = [
      [1, "a"],
      [2, "a"],
      [2, "b"]
    ];

    assert.deepStrictEqual(keyBy(array, 0), { "1": [1, "a"], "2": [2, "b"] });
    assert.deepStrictEqual(keyBy(array, 1), { "a": [2, "a"], "b": [2, "b"] });
  });

  it("should work with an object for `collection`", () => {
    const actual = keyBy({ "a": 6.1, "b": 4.2, "c": 6.3 }, Math.floor);
    assert.deepStrictEqual(actual, { "4": 4.2, "6": 6.3 });
  });


});
