import * as assert from "assert";
import { symbol, noop, mapCaches, LARGE_ARRAY_SIZE } from "./utils";
import map from "../src/map";
import times from "../src/times";
import forOwn from "../src/forOwn";
import each from "../src/each";
import { every } from "../src/every";


describe("map caches", () => {

  const keys = [null, undefined, false, true, 1, -Infinity, NaN, {}, "a", symbol || noop];

  const pairs = map(keys, (key, index) => {
    const lastIndex = keys.length - 1;
    return [key, keys[lastIndex - index]];
  });

  function createCaches(pairs) {
    const largeStack = new mapCaches.Stack(pairs),
      length = pairs ? pairs.length : 0;

    times(LARGE_ARRAY_SIZE - length, () => {
      largeStack.set({}, {});
    });

    return {
      "hashes": new mapCaches.Hash(pairs),
      "list caches": new mapCaches.ListCache(pairs),
      "map caches": new mapCaches.MapCache(pairs),
      "stack caches": new mapCaches.Stack(pairs),
      "large stacks": largeStack
    };
  }

  forOwn(createCaches(pairs), (cache, kind) => {
    const isLarge = /^large/.test(kind);

    it(`should implement a \`Map\` interface for ${kind}`, () => {
      each(keys, (key, index) => {
        const value = pairs[index][1];

        assert.deepStrictEqual(cache.get(key), value);
        assert.strictEqual(cache.has(key), true);
        assert.strictEqual(cache.delete(key), true);
        assert.strictEqual(cache.has(key), false);
        assert.strictEqual(cache.get(key), undefined);
        assert.strictEqual(cache.delete(key), false);
        assert.strictEqual(cache.set(key, value), cache);
        assert.strictEqual(cache.has(key), true);
      });

      assert.strictEqual(cache.size, isLarge ? LARGE_ARRAY_SIZE : keys.length);
      assert.strictEqual(cache.clear(), undefined);
      assert.ok(every(keys, (key) => !cache.has(key)));
    });
  });

  forOwn(createCaches(), (cache, kind) => {

    it(`should support changing values of ${kind}`, () => {
      each(keys, (key) => {
        cache.set(key, 1).set(key, 2);
        assert.strictEqual(cache.get(key), 2);
      });
    });

  });
});
