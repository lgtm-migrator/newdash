import * as assert from "assert";
import lt from "../src/lt";

describe("lt", () => {
  it("should return `true` if `value` is less than `other`", () => {
    assert.strictEqual(lt(1, 3), true);
    assert.strictEqual(lt("abc", "def"), true);
  });

  it("should return `false` if `value` >= `other`", () => {
    assert.strictEqual(lt(3, 1), false);
    assert.strictEqual(lt(3, 3), false);
    assert.strictEqual(lt("def", "abc"), false);
    assert.strictEqual(lt("def", "def"), false);
  });
});
