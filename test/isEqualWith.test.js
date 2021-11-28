import * as assert from "assert";
import { slice, noop, stubC, falsey, stubFalse } from "./utils";
import isEqualWith from "../src/isEqualWith";
import isString from "../src/isString";
import without from "../src/without";
import partial from "../src/partial";
import map from "../src/map";
import each from "../src/each";
import toArray from "../src/toArray";
import constant from "../src/constant";

describe("isEqualWith", () => {
  it("should provide correct `customizer` arguments", () => {
    const argsList = [],
      object1 = { "a": [1, 2], "b": null },
      object2 = { "a": [1, 2], "b": null };

    // circular reference objects
    object1.b = object2;
    object2.b = object1;

    const expected = [
      [object1, object2],
      [object1.a, object2.a, "a", object1, object2],
      [object1.a[0], object2.a[0], 0, object1.a, object2.a],
      [object1.a[1], object2.a[1], 1, object1.a, object2.a],
      [object1.b, object2.b, "b", object1.b, object2.b]
    ];

    isEqualWith(object1, object2, function() {
      const length = arguments.length,
        args = slice.call(arguments, 0, length - (length > 2 ? 1 : 0));
      argsList.push(args);
    });

    // deno assert not support circular reference
    assert.deepStrictEqual(argsList, expected);
  });

  it("should handle comparisons when `customizer` returns `undefined`", () => {
    assert.strictEqual(isEqualWith("a", "a", noop), true);
    assert.strictEqual(isEqualWith(["a"], ["a"], noop), true);
    assert.strictEqual(isEqualWith({ "0": "a" }, { "0": "a" }, noop), true);
  });

  it("should not handle comparisons when `customizer` returns `true`", () => {
    const customizer = function(value) {
      return isString(value) || undefined;
    };

    assert.strictEqual(isEqualWith("a", "b", customizer), true);
    assert.strictEqual(isEqualWith(["a"], ["b"], customizer), true);
    assert.strictEqual(isEqualWith({ "0": "a" }, { "0": "b" }, customizer), true);
  });

  it("should not handle comparisons when `customizer` returns `false`", () => {
    const customizer = function(value) {
      return isString(value) ? false : undefined;
    };

    assert.strictEqual(isEqualWith("a", "a", customizer), false);
    assert.strictEqual(isEqualWith(["a"], ["a"], customizer), false);
    assert.strictEqual(isEqualWith({ "0": "a" }, { "0": "a" }, customizer), false);
  });

  it("should return a boolean value even when `customizer` does not", () => {
    let actual = isEqualWith("a", "b", stubC);
    assert.strictEqual(actual, true);

    const values = without(falsey, undefined),
      expected = map(values, stubFalse);

    actual = [];
    each(values, (value) => {
      actual.push(isEqualWith("a", "a", constant(value)));
    });

    assert.deepStrictEqual(actual, expected);
  });

  it("should ensure `customizer` is a function", () => {
    const array = [1, 2, 3],
      eq = partial(isEqualWith, array),
      actual = map([array, [1, 0, 3]], eq);

    assert.deepStrictEqual(actual, [true, false]);
  });

  it("should call `customizer` for values maps and sets", () => {
    const value = { "a": { "b": 2 } };

    if (Map) {
      var map1 = new Map;
      map1.set("a", value);

      var map2 = new Map;
      map2.set("a", value);
    }
    if (Set) {
      var set1 = new Set;
      set1.add(value);

      var set2 = new Set;
      set2.add(value);
    }
    each([[map1, map2], [set1, set2]], (pair, index) => {
      if (pair[0]) {
        const argsList = [],
          array = toArray(pair[0]);

        const expected = [
          [pair[0], pair[1]],
          [array[0], array[0], 0, array, array],
          [array[0][0], array[0][0], 0, array[0], array[0]],
          [array[0][1], array[0][1], 1, array[0], array[0]]
        ];

        if (index) {
          expected.length = 2;
        }
        isEqualWith(pair[0], pair[1], function() {
          const length = arguments.length,
            args = slice.call(arguments, 0, length - (length > 2 ? 1 : 0));

          argsList.push(args);
        });

        assert.deepStrictEqual(argsList, expected, index ? "Set" : "Map");
      }
    });
  });
});
