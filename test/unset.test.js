import * as assert from "assert";
import { symbol, numberProto, stringProto, defineProperty } from "./utils";
import unset from "../src/unset";
import each from "../src/each";
import map from "../src/map";
import constant from "../src/constant";
import toString from "../src/toString";

describe("unset", () => {
  it("should unset property values", () => {
    each(["a", ["a"]], (path) => {
      const object = { "a": 1, "c": 2 };
      assert.strictEqual(unset(object, path), true);
      assert.deepStrictEqual(object, { "c": 2 });
    });
  });

  it("should preserve the sign of `0`", () => {
    const props = [-0, Object(-0), 0, Object(0)],
      expected = map(props, constant([true, false]));

    const actual = map(props, (key) => {
      const object = { "-0": "a", "0": "b" };
      return [unset(object, key), toString(key) in object];
    });

    assert.deepStrictEqual(actual, expected);
  });

  it("should unset symbol keyed property values", () => {
    if (Symbol) {
      const object = {};
      object[symbol] = 1;

      assert.strictEqual(unset(object, symbol), true);
      assert.ok(!(symbol in object));
    }
  });

  it("should unset deep property values", () => {
    each(["a.b", ["a", "b"]], (path) => {
      const object = { "a": { "b": null } };
      assert.strictEqual(unset(object, path), true);
      assert.deepStrictEqual(object, { "a": {} });
    });
  });

  it("should handle complex paths", () => {
    const paths = [
      'a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g',
      ["a", "-1.23", '["b"]', "c", "['d']", "\ne\n", "f", "g"]
    ];

    each(paths, (path) => {
      const object = { "a": { "-1.23": { '["b"]': { "c": { "['d']": { "\ne\n": { "f": { "g": 8 } } } } } } } };
      assert.strictEqual(unset(object, path), true);
      assert.ok(!("g" in object.a[-1.23]['["b"]'].c["['d']"]["\ne\n"].f));
    });
  });

  it("should return `true` for nonexistent paths", () => {
    const object = { "a": { "b": { "c": null } } };

    each(["z", "a.z", "a.b.z", "a.b.c.z"], (path) => {
      assert.strictEqual(unset(object, path), true);
    });

    assert.deepStrictEqual(object, { "a": { "b": { "c": null } } });
  });

  it("should not error when `object` is nullish", () => {
    const values = [null, undefined],
      expected = [[true, true], [true, true]];

    const actual = map(values, (value) => {
      try {
        return [unset(value, "a.b"), unset(value, ["a", "b"])];
      } catch (e) {
        return e.message;
      }
    });

    assert.deepStrictEqual(actual, expected);
  });

  it("should follow `path` over non-plain objects", () => {
    const object = { "a": "" },
      paths = ["constructor.prototype.a", ["constructor", "prototype", "a"]];

    each(paths, (path) => {
      numberProto.a = 1;

      const actual = unset(0, path);
      assert.strictEqual(actual, true);
      assert.ok(!("a" in numberProto));

      delete numberProto.a;
    });

    each(["a.replace.b", ["a", "replace", "b"]], (path) => {
      stringProto.replace.b = 1;

      const actual = unset(object, path);
      assert.strictEqual(actual, true);
      assert.ok(!("a" in stringProto.replace));

      delete stringProto.replace.b;
    });
  });

  it("should return `false` for non-configurable properties", () => {
    const object = {};

    defineProperty(object, "a", {
      "configurable": false,
      "enumerable": true,
      "writable": true,
      "value": 1
    });

    assert.strictEqual(unset(object, "a"), false);

  });

});
