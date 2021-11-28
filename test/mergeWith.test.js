import * as assert from "assert";
import { noop, identity, isNpm, mapCaches } from "./utils";
import mergeWith from "../src/mergeWith";
import last from "../src/last";
import isArray from "../src/isArray";

describe("mergeWith", () => {
  it("should handle merging when `customizer` returns `undefined`", () => {
    let actual = mergeWith({ "a": { "b": [1, 1] } }, { "a": { "b": [0] } }, noop);
    assert.deepStrictEqual(actual, { "a": { "b": [0, 1] } });

    actual = mergeWith([], [undefined], identity);
    assert.deepStrictEqual(actual, [undefined]);
  });

  it("should clone sources when `customizer` returns `undefined`", () => {
    const source1 = { "a": { "b": { "c": 1 } } },
      source2 = { "a": { "b": { "d": 2 } } };

    mergeWith({}, source1, source2, noop);
    assert.deepStrictEqual(source1.a.b, { "c": 1 });
  });

  it("should defer to `customizer` for non `undefined` results", () => {
    const actual = mergeWith({ "a": { "b": [0, 1] } }, { "a": { "b": [2] } }, (a, b) => isArray(a) ? a.concat(b) : undefined);

    assert.deepStrictEqual(actual, { "a": { "b": [0, 1, 2] } });
  });

  it("should provide `stack` to `customizer`", () => {
    let actual;

    mergeWith({}, { "a": { "b": 2 } }, function() {
      actual = last(arguments);
    });

    assert.ok(isNpm
      ? actual.constructor.name == "Stack"
      : actual instanceof mapCaches.Stack
    );
  });

  it("should overwrite primitives with source object clones", () => {
    const actual = mergeWith({ "a": 0 }, { "a": { "b": ["c"] } }, (a, b) => isArray(a) ? a.concat(b) : undefined);

    assert.deepStrictEqual(actual, { "a": { "b": ["c"] } });
  });

  it("should pop the stack of sources for each sibling property", () => {
    const array = ["b", "c"],
      object = { "a": ["a"] },
      source = { "a": array, "b": array };

    const actual = mergeWith(object, source, (a, b) => isArray(a) ? a.concat(b) : undefined);

    assert.deepStrictEqual(actual, { "a": ["a", "b", "c"], "b": ["b", "c"] });
  });
});
