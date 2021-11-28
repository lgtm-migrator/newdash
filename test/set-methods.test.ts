// @ts-nocheck
import * as assert from "assert";
import { symbol, defineProperty } from "./utils";
import unset from "../src/unset";
import each from "../src/each";
import constant from "../src/constant";
import map from "../src/map";
import update from "../src/update";
import updateWith from "../src/updateWith";
import set from "../src/set";
import setWith from "../src/setWith";
import toString from "../src/toString";
import get from "../src/get";


describe("set methods", () => {

  each([[update, "update"], [updateWith, "updateWith"], [set, "set"], [setWith, "setWith"]], ([func, methodName]) => {

    const isUpdate = /^update/.test(methodName as string);

    const oldValue = 1,
      value = 2,
      updater = isUpdate ? constant(value) : value;

    it(`\`_.${methodName}\` should set property values`, () => {
      each(["a", ["a"]], (path) => {
        const object = { "a": oldValue },
          actual = func(object, path, updater);

        assert.strictEqual(actual, object);
        assert.strictEqual(object.a, value);
      });
    });

    it(`\`_.${methodName}\` should preserve the sign of \`0\``, () => {
      const props = [-0, Object(-0), 0, Object(0)],
        expected = map(props, constant(value));

      const actual = map(props, (key) => {
        const object = { "-0": "a", "0": "b" };
        func(object, key, updater);
        return object[toString(key)];
      });

      assert.deepStrictEqual(actual, expected);
    });

    it(`\`_.${methodName}\` should unset symbol keyed property values`, () => {
      if (Symbol) {
        const object = {};
        object[symbol] = 1;

        assert.strictEqual(unset(object, symbol), true);
        assert.ok(!(symbol in object));
      }
    });

    it(`\`_.${methodName}\` should set deep property values`, () => {
      each(["a.b", ["a", "b"]], (path) => {
        const object = { "a": { "b": oldValue } },
          actual = func(object, path, updater);

        assert.strictEqual(actual, object);
        assert.strictEqual(object.a.b, value);
      });
    });

    it(`\`_.${methodName}\` should set a key over a path`, () => {
      each(["a.b", ["a.b"]], (path) => {
        const object = { "a.b": oldValue },
          actual = func(object, path, updater);

        assert.strictEqual(actual, object);
        assert.deepStrictEqual(object, { "a.b": value });
      });
    });

    it(`\`_.${methodName}\` should not coerce array paths to strings`, () => {
      const object = { "a,b,c": 1, "a": { "b": { "c": 1 } } };

      func(object, ["a", "b", "c"], updater);
      assert.strictEqual(object.a.b.c, value);
    });

    it(`\`_.${methodName}\` should not ignore empty brackets`, () => {
      const object = {};

      func(object, "a[]", updater);
      assert.deepStrictEqual(object, { "a": { "": value } });
    });

    it(`\`_.${methodName}\` should handle empty paths`, () => {
      each([["", ""], [[], [""]]], (pair, index) => {
        const object = {};

        func(object, pair[0], updater);
        assert.deepStrictEqual(object, index ? {} : { "": value });

        func(object, pair[1], updater);
        assert.deepStrictEqual(object, { "": value });
      });
    });

    it(`\`_.${methodName}\` should handle complex paths`, () => {
      const object = { "a": { "1.23": { '["b"]': { "c": { "['d']": { "\ne\n": { "f": { "g": oldValue } } } } } } } };

      const paths = [
        'a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g',
        ["a", "-1.23", '["b"]', "c", "['d']", "\ne\n", "f", "g"]
      ];

      each(paths, (path) => {
        func(object, path, updater);
        assert.strictEqual(object.a[-1.23]['["b"]'].c["['d']"]["\ne\n"].f.g, value);
        object.a[-1.23]['["b"]'].c["['d']"]["\ne\n"].f.g = oldValue;
      });
    });

    it(`\`_.${methodName}\` should create parts of \`path\` that are missing`, () => {
      const object = {};
      const expect = { "a": [undefined, { "b": { "c": value } }] };

      each(["a[1].b.c", ["a", "1", "b", "c"]], (path) => {
        const actual = func(object, path, updater);

        assert.strictEqual(actual, object);
        assert.strictEqual(get(actual, path), value);
        assert.ok(!("0" in object.a));

        delete object.a;
      });
    });

    it(`\`_.${methodName}\` should not error when \`object\` is nullish`, () => {
      const values = [null, undefined],
        expected = [[null, null], [undefined, undefined]];

      const actual = map(values, (value) => {
        try {
          return [func(value, "a.b", updater), func(value, ["a", "b"], updater)];
        } catch (e) {
          return e.message;
        }
      });

      assert.deepStrictEqual(actual, expected);
    });

    it(`\`_.${methodName}\` should overwrite primitives in the path`, () => {
      each(["a.b", ["a", "b"]], (path) => {
        const object = { "a": "" };

        func(object, path, updater);
        assert.deepStrictEqual(object, { "a": { "b": 2 } });
      });
    });

    it(`\`_.${methodName}\` should not create an array for missing non-index property names that start with numbers`, () => {
      const object = {};

      func(object, ["1a", "2b", "3c"], updater);
      assert.deepStrictEqual(object, { "1a": { "2b": { "3c": value } } });
    });

    it(`\`_.${methodName}\` should not assign values that are the same as their destinations`, () => {
      each(["a", ["a"], { "a": 1 }, NaN], (value) => {
        let object = {},
          pass = true,
          updater = isUpdate ? constant(value) : value;

        defineProperty(object, "a", {
          "configurable": true,
          "enumerable": true,
          "get": constant(value),
          "set": function() { pass = false; }
        });

        func(object, "a", updater);
        assert.ok(pass);
      });
    });
  });
});
