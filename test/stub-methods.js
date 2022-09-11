import * as assert from "assert";
import lodashStable from "../src";
import { empties, _ } from "./utils";

describe("stub methods", () => {
  lodashStable.each(["noop", "stubTrue", "stubFalse", "stubArray", "stubObject", "stubString"], (methodName) => {
    const func = _[methodName];

    const pair = ({
      "stubArray": [[], "an empty array"],
      "stubFalse": [false, "`false`"],
      "stubObject": [{}, "an empty object"],
      "stubString": ["", "an empty string"],
      "stubTrue": [true, "`true`"],
      "noop": [undefined, "`undefined`"]
    })[methodName];

    const values = Array(2).concat(empties, true, 1, "a"),
      expected = lodashStable.map(values, lodashStable.constant(pair[0]));

    it(`\`_.${methodName}\` should return ${pair[1]}`, () => {
      const actual = lodashStable.map(values, (value, index) => {
        if (index < 2) {
          return index ? func.call({}) : func();
        }
        return func(value);
      });

      assert.deepStrictEqual(actual, expected);
    });
  });
});
