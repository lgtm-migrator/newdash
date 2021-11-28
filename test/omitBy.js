import * as assert from "assert";
import omitBy from "../src/omitBy";

describe("omitBy", () => {
  it("should work with a predicate argument", () => {
    const object = { "a": 1, "b": 2, "c": 3, "d": 4 };

    const actual = omitBy(object, (n) => n != 2 && n != 4);

    assert.deepStrictEqual(actual, { "b": 2, "d": 4 });
  });
});
