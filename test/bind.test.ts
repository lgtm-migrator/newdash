import * as assert from "assert";
import { push, falsey, stubTrue } from "./utils";
import bind from "../src/bind";
import reject from "../src/reject";
import map from "../src/map";
import every from "../src/every";
import isEqual from "../src/eqDeep";
import times from "../src/times";
import constant from "../src/constant";
import attempt from "../src/attempt";

describe("bind", () => {

  function fn(...args: any[]) {
    const result = [this];
    push.apply(result, arguments);
    return result;
  }

  it("should bind a function to an object", () => {
    const object = {},
      bound = bind(fn, object);

    assert.deepStrictEqual(bound("a"), [object, "a"]);
  });

  it("should accept a falsey `thisArg`", () => {
    const values = reject(falsey.slice(1), (value) => value == null),
      expected = map(values, (value) => [value]);

    const actual = map(values, (value) => {
      try {
        const bound = bind(fn, value);
        return bound();
      } catch (e) { }
    });

    assert.ok(every(actual, (value, index) => isEqual(value, expected[index])));
  });

  it("should bind a function to nullish values", () => {
    let bound = bind(fn, null),
      actual = bound("a");

    assert.ok((actual[0] === null) || (actual[0] && actual[0].Array));
    assert.strictEqual(actual[1], "a");

    times(2, (index) => {
      bound = index ? bind(fn, undefined) : bind(fn);
      actual = bound("b");

      assert.ok((actual[0] === undefined) || (actual[0] && actual[0].Array));
      assert.strictEqual(actual[1], "b");
    });
  });

  it("should partially apply arguments ", () => {
    let object = {},
      bound = bind(fn, object, "a");

    assert.deepStrictEqual(bound(), [object, "a"]);

    bound = bind(fn, object, "a");
    assert.deepStrictEqual(bound("b"), [object, "a", "b"]);

    bound = bind(fn, object, "a", "b");
    assert.deepStrictEqual(bound(), [object, "a", "b"]);
    assert.deepStrictEqual(bound("c", "d"), [object, "a", "b", "c", "d"]);
  });

  it("should support placeholders", () => {
    const object = {};
    const bound = bind(fn, object, bind.placeholder, "b", bind.placeholder);

    assert.deepStrictEqual(bound("a", "c"), [object, "a", "b", "c"]);
    assert.deepStrictEqual(bound("a"), [object, "a", "b", undefined]);
    assert.deepStrictEqual(bound("a", "c", "d"), [object, "a", "b", "c", "d"]);
    assert.deepStrictEqual(bound(), [object, undefined, "b", undefined]);
  });


  it("should create a function with a `length` of `0`", () => {
    let fn = function(a, b, c) { },
      bound = bind(fn, {});

    assert.strictEqual(bound.length, 0);

    bound = bind(fn, {}, 1);
    assert.strictEqual(bound.length, 0);
  });

  it("should ignore binding when called with the `new` operator", () => {
    function Foo() {
      return this;
    }

    const bound = bind(Foo, { "a": 1 });
    // @ts-ignore
    const newBound = new bound;

    assert.strictEqual(bound().a, 1);
    assert.strictEqual(newBound.a, undefined);
    assert.ok(newBound instanceof Foo);
  });

  it("should handle a number of arguments when called with the `new` operator", () => {
    function Foo(...args: any[]) {

    }

    function Bar(...args: any[]) { }

    const thisArg = { "a": 1 },
      boundFoo = bind(Foo, thisArg),
      boundBar = bind(Bar, thisArg),
      count = 9,
      expected = times(count, constant([undefined, undefined]));

    const actual = times(count, (index) => {
      try {
        switch (index) {
          case 0: return [new boundFoo().a, new boundBar().a];
          case 1: return [new boundFoo(1).a, new boundBar(1).a];
          case 2: return [new boundFoo(1, 2).a, new boundBar(1, 2).a];
          case 3: return [new boundFoo(1, 2, 3).a, new boundBar(1, 2, 3).a];
          case 4: return [new boundFoo(1, 2, 3, 4).a, new boundBar(1, 2, 3, 4).a];
          case 5: return [new boundFoo(1, 2, 3, 4, 5).a, new boundBar(1, 2, 3, 4, 5).a];
          case 6: return [new boundFoo(1, 2, 3, 4, 5, 6).a, new boundBar(1, 2, 3, 4, 5, 6).a];
          case 7: return [new boundFoo(1, 2, 3, 4, 5, 6, 7).a, new boundBar(1, 2, 3, 4, 5, 6, 7).a];
          case 8: return [new boundFoo(1, 2, 3, 4, 5, 6, 7, 8).a, new boundBar(1, 2, 3, 4, 5, 6, 7, 8).a];
        }
      } catch (e) { }
    });

    assert.deepStrictEqual(actual, expected);
  });

  it("should ensure `new bound` is an instance of `func`", () => {
    function Foo(value) {
      return value && object;
    }

    var bound = bind(Foo),
      object = {};

    // @ts-ignore
    assert.ok(new bound instanceof Foo);
    // @ts-ignore
    assert.strictEqual(new bound(true), object);
  });

  it("should append array arguments to partially applied arguments", () => {
    const object = {},
      bound = bind(fn, object, "a");

    assert.deepStrictEqual(bound(["b"], "c"), [object, "a", ["b"], "c"]);
  });

  it("should not rebind functions", () => {
    const object1 = {},
      object2 = {},
      object3 = {};

    const bound1 = bind(fn, object1),
      bound2 = bind(bound1, object2, "a"),
      bound3 = bind(bound1, object3, "b");

    assert.deepStrictEqual(bound1(), [object1]);
    assert.deepStrictEqual(bound2(), [object1, "a"]);
    assert.deepStrictEqual(bound3(), [object1, "b"]);
  });

  it("should not error when instantiating bound built-ins", () => {
    let Ctor = bind(Date, null),
      expected = new Date(2012, 4, 23, 0, 0, 0, 0);

    try {
      var actual = new Ctor(2012, 4, 23, 0, 0, 0, 0);
    } catch (e) { }

    assert.deepStrictEqual(actual, expected);

    Ctor = bind(Date, null, 2012, 4, 23);

    try {
      actual = new Ctor(0, 0, 0, 0);
    } catch (e) { }

    assert.deepStrictEqual(actual, expected);
  });

  it("should not error when calling bound class constructors with the `new` operator", () => {
    const createCtor = attempt(Function, '"use strict";return class A{}');

    if (typeof createCtor === "function") {
      const bound = bind(createCtor()),
        count = 8,
        expected = times(count, stubTrue);

      const actual = times(count, (index) => {
        try {
          switch (index) {
            case 0: return !!(new bound);
            case 1: return !!(new bound(1));
            case 2: return !!(new bound(1, 2));
            case 3: return !!(new bound(1, 2, 3));
            case 4: return !!(new bound(1, 2, 3, 4));
            case 5: return !!(new bound(1, 2, 3, 4, 5));
            case 6: return !!(new bound(1, 2, 3, 4, 5, 6));
            case 7: return !!(new bound(1, 2, 3, 4, 5, 6, 7));
          }
        } catch (e) { }
      });

      assert.deepStrictEqual(actual, expected);
    }
  });

});
