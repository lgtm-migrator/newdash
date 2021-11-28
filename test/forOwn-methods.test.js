import * as assert from "assert";
import forOwn from "../src/forOwn";
import forOwnRight from "../src/forOwnRight";
import each from "../src/each";

describe("forOwn methods", () => {

  each([["forOwn", forOwn], ["forOwnRight", forOwnRight]], ([methodName, func]) => {

    it(`\`${methodName}\` should iterate over \`length\` properties`, () => {
      const object = { "0": "zero", "1": "one", "length": 2 },
        props = [];

      func(object, (value, prop) => { props.push(prop); });

      assert.deepStrictEqual(props.sort(), ["0", "1", "length"]);
    });

  });

});
