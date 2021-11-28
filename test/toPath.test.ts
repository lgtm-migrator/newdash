import * as assert from "assert";
import { symbol } from "./utils";
import toPath from "../src/toPath";
import each from "../src/each";
import isSymbol from "../src/isSymbol";

describe("toPath", () => {

  it("should convert a string to a path", () => {
    assert.deepStrictEqual(toPath("a.b.c"), ["a", "b", "c"]);
    assert.deepStrictEqual(toPath("a[0].b.c"), ["a", "0", "b", "c"]);
  });

  it("should coerce array elements to strings", () => {
    const array = ["a", "b", "c"];
    const actual = toPath(array);
    assert.deepStrictEqual(actual, array);
    assert.notStrictEqual(actual, array);
  });

  it("should return new path array", () => {
    assert.notStrictEqual(toPath("a.b.c"), toPath("a.b.c"));
  });

  it("should not coerce symbols to strings", () => {
    if (Symbol) {
      const object = Object(symbol);
      each([symbol, object, [symbol], [object]], (value) => {
        const actual = toPath(value);
        assert.ok(isSymbol(actual[0]));
      });
    }
  });

  it("should handle complex paths", () => {
    const actual = toPath('a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g');
    assert.deepStrictEqual(actual, ["a", "-1.23", '["b"]', "c", "['d']", "\ne\n", "f", "g"]);
  });

  it("should handle consecutive empty brackets and dots", () => {
    let expected = ["", "a"];
    assert.deepStrictEqual(toPath(".a"), expected);
    assert.deepStrictEqual(toPath("[].a"), expected);

    expected = ["", "", "a"];
    assert.deepStrictEqual(toPath("..a"), expected);
    assert.deepStrictEqual(toPath("[][].a"), expected);

    expected = ["a", "", "b"];
    assert.deepStrictEqual(toPath("a..b"), expected);
    assert.deepStrictEqual(toPath("a[].b"), expected);

    expected = ["a", "", "", "b"];
    assert.deepStrictEqual(toPath("a...b"), expected);
    assert.deepStrictEqual(toPath("a[][].b"), expected);

    expected = ["a", ""];
    assert.deepStrictEqual(toPath("a."), expected);
    assert.deepStrictEqual(toPath("a[]"), expected);

    expected = ["a", "", ""];
    assert.deepStrictEqual(toPath("a.."), expected);
    assert.deepStrictEqual(toPath("a[][]"), expected);
  });

});
