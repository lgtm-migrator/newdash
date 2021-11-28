import * as assert from "assert";
import constant from "../src/constant";
import each from "../src/each";
import { map } from "../src/map";
import truncate from "../src/truncate";

describe("truncate", () => {

  const string = "hi-diddly-ho there, neighborino";

  it("should use a default `length` of `30`", () => {
    assert.strictEqual(truncate(string), "hi-diddly-ho there, neighbo...");
  });

  it("should not truncate if `string` is <= `length`", () => {
    assert.strictEqual(truncate(string, { "length": string.length }), string);
    assert.strictEqual(truncate(string, { "length": string.length + 2 }), string);
  });

  it("should truncate string the given length", () => {
    assert.strictEqual(truncate(string, { "length": 24 }), "hi-diddly-ho there, n...");
  });

  it("should support a `omission` option", () => {
    assert.strictEqual(truncate(string, { "omission": " [...]" }), "hi-diddly-ho there, neig [...]");
  });

  it("should coerce nullish `omission` values to strings", () => {
    assert.strictEqual(truncate(string, { "omission": null }), "hi-diddly-ho there, neighbnull");
    assert.strictEqual(truncate(string, { "omission": undefined }), "hi-diddly-ho there, nundefined");
  });

  it("should support a `length` option", () => {
    assert.strictEqual(truncate(string, { "length": 4 }), "h...");
  });

  it("should support a `separator` option", () => {
    assert.strictEqual(truncate(string, { "length": 24, "separator": " " }), "hi-diddly-ho there,...");
    assert.strictEqual(truncate(string, { "length": 24, "separator": /,? +/ }), "hi-diddly-ho there...");
    assert.strictEqual(truncate(string, { "length": 24, "separator": /,? +/g }), "hi-diddly-ho there...");
  });

  it("should treat negative `length` as `0`", () => {
    each([0, -2], (length) => {
      assert.strictEqual(truncate(string, { "length": length }), "...");
    });
  });

  it("should coerce `string` to a string", () => {
    assert.strictEqual(truncate(Object(string), { "length": 4 }), "h...");
    assert.strictEqual(truncate({ "toString": constant(string) }, { "length": 5 }), "hi...");
  });

  it("should work as an iteratee for methods like `_.map`", () => {
    const actual = map([string, string, string], truncate),
      truncated = "hi-diddly-ho there, neighbo...";

    assert.deepStrictEqual(actual, [truncated, truncated, truncated]);
  });

});
