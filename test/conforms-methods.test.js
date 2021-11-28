import * as assert from "assert";
import { _, stubFalse, stubTrue, empties } from "./utils";
import { conformsTo } from "../src/conformsTo";
import { conforms as fConforms } from "../src/conforms";
import each from "../src/each";
import filter from "../src/filter";
import map from "../src/map";


describe("conforms methods", () => {
  each(["conforms", "conformsTo"], (methodName) => {
    const isConforms = methodName == "conforms";

    function conforms(source) {
      return isConforms ? fConforms(source) : function(object) {
        return conformsTo(object, source);
      };
    }

    it(`\`_.${methodName}\` should check if \`object\` conforms to \`source\``, () => {
      const objects = [
        { "a": 1, "b": 8 },
        { "a": 2, "b": 4 },
        { "a": 3, "b": 16 }
      ];

      let par = conforms({
        "b": function(value) { return value > 4; }
      });

      let actual = filter(objects, par);
      assert.deepStrictEqual(actual, [objects[0], objects[2]]);

      par = conforms({
        "b": function(value) { return value > 8; },
        "a": function(value) { return value > 1; }
      });

      actual = filter(objects, par);
      assert.deepStrictEqual(actual, [objects[2]]);
    });

    it(`\`_.${methodName}\` should not match by inherited \`source\` properties`, () => {
      function Foo() {
        this.a = function(value) {
          return value > 1;
        };
      }
      Foo.prototype.b = function(value) {
        return value > 8;
      };

      const objects = [
        { "a": 1, "b": 8 },
        { "a": 2, "b": 4 },
        { "a": 3, "b": 16 }
      ];

      const par = conforms(new Foo),
        actual = filter(objects, par);

      assert.deepStrictEqual(actual, [objects[1], objects[2]]);
    });

    it(`\`_.${methodName}\` should not invoke \`source\` predicates for missing \`object\` properties`, () => {
      let count = 0;

      const par = conforms({
        "a": function() { count++; return true; }
      });

      assert.strictEqual(par({}), false);
      assert.strictEqual(count, 0);
    });

    it(`\`_.${methodName}\` should work with a function for \`object\``, () => {
      function Foo() { }
      Foo.a = 1;

      function Bar() { }
      Bar.a = 2;

      const par = conforms({
        "a": function(value) { return value > 1; }
      });

      assert.strictEqual(par(Foo), false);
      assert.strictEqual(par(Bar), true);
    });

    it(`\`_.${methodName}\` should work with a function for \`source\``, () => {
      function Foo() { }
      Foo.a = function(value) { return value > 1; };

      const objects = [{ "a": 1 }, { "a": 2 }],
        actual = filter(objects, conforms(Foo));

      assert.deepStrictEqual(actual, [objects[1]]);
    });

    it(`\`_.${methodName}\` should work with a non-plain \`object\``, () => {
      function Foo() {
        this.a = 1;
      }
      Foo.prototype.b = 2;

      const par = conforms({
        "b": function(value) { return value > 1; }
      });

      assert.strictEqual(par(new Foo), true);
    });

    it(`\`_.${methodName}\` should return \`false\` when \`object\` is nullish`, () => {
      const values = [, null, undefined],
        expected = map(values, stubFalse);

      const par = conforms({
        "a": function(value) { return value > 1; }
      });

      const actual = map(values, (value, index) => {
        try {
          return index ? par(value) : par();
        } catch (e) { }
      });

      assert.deepStrictEqual(actual, expected);
    });

    it(`\`_.${methodName}\` should return \`true\` when comparing an empty \`source\` to a nullish \`object\``, () => {
      const values = [, null, undefined],
        expected = map(values, stubTrue),
        par = conforms({});

      const actual = map(values, (value, index) => {
        try {
          return index ? par(value) : par();
        } catch (e) { }
      });

      assert.deepStrictEqual(actual, expected);
    });

    it(`\`_.${methodName}\` should return \`true\` when comparing an empty \`source\``, () => {
      const object = { "a": 1 },
        expected = map(empties, stubTrue);

      const actual = map(empties, (value) => {
        const par = conforms(value);
        return par(object);
      });

      assert.deepStrictEqual(actual, expected);
    });
  });
});
