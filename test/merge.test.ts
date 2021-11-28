import * as assert from "assert";

import merge from "../src/merge";
import map from "../src/map";
import isArray from "../src/isArray";
import range from "../src/range";
import isBuffer from "../src/isBuffer";
import isEqual from "../src/isEqual";
import assign from "../src/assign";
import isArguments from "../src/isArguments";

import { args, typedArrays, stubTrue, defineProperty, document, root } from "./utils";

describe("merge", () => {
  it("should merge `source` into `object`", () => {
    const names = {
      "characters": [
        { "name": "barney" },
        { "name": "fred" }
      ]
    };

    const ages = {
      "characters": [
        { "age": 36 },
        { "age": 40 }
      ]
    };

    const heights = {
      "characters": [
        { "height": '5\'4"' },
        { "height": '5\'5"' }
      ]
    };

    const expected = {
      "characters": [
        { "name": "barney", "age": 36, "height": '5\'4"' },
        { "name": "fred", "age": 40, "height": '5\'5"' }
      ]
    };

    assert.deepStrictEqual(merge(names, ages, heights), expected);
  });

  it("should merge sources containing circular references", () => {
    const object = {
      "foo": { "a": 1 },
      "bar": { "a": 2 }
    };

    const source = {
      "foo": { "b": { "c": { "d": {} } } },
      "bar": {}
    };

    source.foo.b.c.d = source;
    // @ts-ignore
    source.bar.b = source.foo.b;

    const actual = merge(object, source);

    // @ts-ignore
    assert.notStrictEqual(actual.bar.b, actual.foo.b);
    // @ts-ignore
    assert.strictEqual(actual.foo.b.c.d, actual.foo.b.c.d.foo.b.c.d);
  });

  it("should work with four arguments", () => {
    const expected = { "a": 4 },
      actual = merge({ "a": 1 }, { "a": 2 }, { "a": 3 }, expected);

    assert.deepStrictEqual(actual, expected);
  });

  it("should merge onto function `object` values", () => {
    function Foo() { }

    const source = { "a": 1 },
      actual = merge(Foo, source);

    assert.strictEqual(actual, Foo);
    // @ts-ignore
    assert.strictEqual(Foo.a, 1);
  });

  it("should merge first source object properties to function", () => {
    const fn = function() { },
      object = { "prop": {} },
      actual = merge({ "prop": fn }, object);

    assert.deepStrictEqual(actual, object);
  });

  it("should merge first and second source object properties to function", () => {
    const fn = function() { },
      object = { "prop": {} },
      actual = merge({ "prop": fn }, { "prop": fn }, object);

    assert.deepStrictEqual(actual, object);
  });

  it("should not merge onto function values of sources", () => {
    let source1 = { "a": function() { } },
      source2 = { "a": { "b": 2 } },
      expected = { "a": { "b": 2 } },
      actual = merge({}, source1, source2);

    assert.deepStrictEqual(actual, expected);
    assert.ok(!("b" in source1.a));

    actual = merge(source1, source2);
    assert.deepStrictEqual(actual, expected);
  });

  it("should merge onto non-plain `object` values", () => {
    function Foo() { }

    const object = new Foo,
      actual = merge(object, { "a": 1 });

    assert.strictEqual(actual, object);
    assert.strictEqual(object.a, 1);
  });

  it("should treat sparse array sources as dense", () => {
    const array = [1];
    array[2] = 3;

    const actual = merge([], array),
      expected = array.slice();

    expected[1] = undefined;

    assert.ok("1" in actual);
    assert.deepStrictEqual(actual, expected);
  });

  it("should merge `arguments` objects", () => {
    let object1 = { "value": args },
      object2 = { "value": { "3": 4 } },
      expected = { "0": 1, "1": 2, "2": 3, "3": 4 },
      actual = merge(object1, object2);

    assert.ok(!("3" in args));
    assert.ok(!isArguments(actual.value));
    assert.deepStrictEqual(actual.value, expected);
    object1.value = args;

    actual = merge(object2, object1);
    assert.ok(!isArguments(actual.value));
    assert.deepStrictEqual(actual.value, expected);

    // @ts-ignore
    expected = { "0": 1, "1": 2, "2": 3 };

    actual = merge({}, object1);
    assert.ok(!isArguments(actual.value));
    assert.deepStrictEqual(actual.value, expected);
  });

  it("should merge typed arrays", () => {
    const array1 = [0],
      array2 = [0, 0],
      array3 = [0, 0, 0, 0],
      array4 = [0, 0, 0, 0, 0, 0, 0, 0];

    const arrays = [array2, array1, array4, array3, array2, array4, array4, array3, array2],
      buffer = ArrayBuffer && new ArrayBuffer(8);

    let expected = map(typedArrays, (type, index) => {
      const array = arrays[index].slice();
      array[0] = 1;
      return root[type] ? { "value": array } : false;
    });

    let actual = map(typedArrays, (type) => {
      const Ctor = root[type];
      return Ctor ? merge({ "value": new Ctor(buffer) }, { "value": [1] }) : false;
    });

    assert.ok(isArray(actual));
    assert.deepStrictEqual(actual, expected);

    expected = map(typedArrays, (type, index) => {
      const array = arrays[index].slice();
      array.push(1);
      return root[type] ? { "value": array } : false;
    });

    actual = map(typedArrays, (type, index) => {
      const Ctor = root[type],
        array = range(arrays[index].length);

      array.push(1);
      return Ctor ? merge({ "value": array }, { "value": new Ctor(buffer) }) : false;
    });

    assert.ok(isArray(actual));
    assert.deepStrictEqual(actual, expected);
  });

  it("should assign `null` values", () => {
    const actual = merge({ "a": 1 }, { "a": null });
    assert.strictEqual(actual.a, null);
  });

  it("should assign non array/buffer/typed-array/plain-object source values directly", () => {
    function Foo() { }

    // @ts-ignore
    const values = [new Foo, new Boolean, new Date, Foo, new Number, new String, new RegExp],
      expected = map(values, stubTrue);

    const actual = map(values, (value) => {
      const object = merge({}, { "a": value, "b": { "c": value } });
      return object.a === value && object.b.c === value;
    });

    assert.deepStrictEqual(actual, expected);
  });

  it("should clone buffer source values", () => {
    if (typeof Buffer == "object") {
      const buffer = Buffer.from([1]),
        actual = merge({}, { "value": buffer }).value;

      assert.ok(isBuffer(actual));
      assert.strictEqual(actual[0], buffer[0]);
      assert.notStrictEqual(actual, buffer);
    }
  });

  it("should deep clone array/typed-array/plain-object source values", () => {
    const typedArray = Uint8Array
      ? new Uint8Array([1])
      : { "buffer": [1] };

    const props = ["0", "buffer", "a"],
      values = [[{ "a": 1 }], typedArray, { "a": [1] }],
      expected = map(values, stubTrue);

    const actual = map(values, (value, index) => {
      const key = props[index],
        object = merge({}, { "value": value }),
        subValue = value[key],
        newValue = object.value,
        newSubValue = newValue[key];

      return (
        newValue !== value &&
        newSubValue !== subValue &&
        isEqual(newValue, value)
      );
    });

    assert.deepStrictEqual(actual, expected);
  });

  it("should not augment source objects", () => {
    let source1 = { "a": [{ "a": 1 }] },
      source2 = { "a": [{ "b": 2 }] },
      actual = merge({}, source1, source2);

    assert.deepStrictEqual(source1.a, [{ "a": 1 }]);
    assert.deepStrictEqual(source2.a, [{ "b": 2 }]);
    assert.deepStrictEqual(actual.a, [{ "a": 1, "b": 2 }]);

    // @ts-ignore
    source1 = { "a": [[1, 2, 3]] };
    // @ts-ignore
    source2 = { "a": [[3, 4]] };
    actual = merge({}, source1, source2);

    assert.deepStrictEqual(source1.a, [[1, 2, 3]]);
    assert.deepStrictEqual(source2.a, [[3, 4]]);
    assert.deepStrictEqual(actual.a, [[3, 4, 3]]);
  });

  it("should merge plain objects onto non-plain objects", () => {
    function Foo(object?) {
      assign(this, object);
    }

    let object = { "a": 1 },
      actual = merge(new Foo, object);

    assert.ok(actual instanceof Foo);
    assert.deepStrictEqual(actual, new Foo(object));

    actual = merge([new Foo], [object]);
    assert.ok(actual[0] instanceof Foo);
    assert.deepStrictEqual(actual, [new Foo(object)]);
  });

  it("should not overwrite existing values with `undefined` values of object sources", () => {
    const actual = merge({ "a": 1 }, { "a": undefined, "b": undefined });
    assert.deepStrictEqual(actual, { "a": 1, "b": undefined });
  });

  it("should not overwrite existing values with `undefined` values of array sources", () => {
    let array = [1];
    array[2] = 3;

    let actual = merge([4, 5, 6], array),
      expected = [1, 5, 3];

    assert.deepStrictEqual(actual, expected);

    array = [1, , 3];
    array[1] = undefined;

    actual = merge([4, 5, 6], array);
    assert.deepStrictEqual(actual, expected);
  });

  it("should skip merging when `object` and `source` are the same value", () => {
    let object = {},
      pass = true;

    defineProperty(object, "a", {
      "configurable": true,
      "enumerable": true,
      "get": function() { pass = false; },
      "set": function() { pass = false; }
    });

    merge(object, object);
    assert.ok(pass);
  });

  it("should convert values to arrays when merging arrays of `source`", () => {
    let object = { "a": { "1": "y", "b": "z", "length": 2 } },
      actual = merge(object, { "a": ["x"] });

    assert.deepStrictEqual(actual, { "a": ["x", "y"] });

    // @ts-ignore
    actual = merge({ "a": {} }, { "a": [] });
    assert.deepStrictEqual(actual, { "a": [] });
  });

  it("should convert strings to arrays when merging arrays of `source`", () => {
    const object = { "a": "abcde" },
      actual = merge(object, { "a": ["x", "y", "z"] });

    assert.deepStrictEqual(actual, { "a": ["x", "y", "z"] });
  });

  it("should not error on DOM elements", () => {
    const object1 = { "el": document && document.createElement("div") },
      object2 = { "el": document && document.createElement("div") },
      pairs = [[{}, object1], [object1, object2]],
      expected = map(pairs, stubTrue);

    const actual = map(pairs, (pair) => {
      try {
        // @ts-ignore
        return merge(pair[0], pair[1]).el === pair[1].el;
      } catch (e) { }
    });

    assert.deepStrictEqual(actual, expected);
  });
});
