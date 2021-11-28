import * as assert from "assert";
import { _, LARGE_ARRAY_SIZE, isEven } from "./utils";
import sortBy from "../src/sortBy";
import each from "../src/each";
import map from "../src/map";
import toString from "../src/toString";
import times from "../src/times";
import { uniq } from "../src/uniq";
import { uniqWith } from "../src/uniqWith";
import { uniqBy } from "../src/uniqBy";
import { sortedUniq } from "../src/sortedUniq";
import { sortedUniqBy } from "../src/sortedUniqBy";


describe("uniq methods", () => {
  each([["uniq", uniq], ["uniqBy", uniqBy], ["uniqWith", uniqWith], ["sortedUniq", sortedUniq], ["sortedUniqBy", sortedUniqBy]], ([methodName, func]) => {
    const isSorted = /^sorted/.test(methodName);
    let objects = [{ "a": 2 }, { "a": 3 }, { "a": 1 }, { "a": 2 }, { "a": 3 }, { "a": 1 }];

    if (isSorted) {
      objects = sortBy(objects, "a");
    }
    else {
      it(`\`_.${methodName}\` should return unique values of an unsorted array`, () => {
        const array = [2, 1, 2];
        assert.deepStrictEqual(func(array), [2, 1]);
      });
    }
    it(`\`_.${methodName}\` should return unique values of a sorted array`, () => {
      const array = [1, 2, 2];
      assert.deepStrictEqual(func(array), [1, 2]);
    });

    it(`\`_.${methodName}\` should treat object instances as unique`, () => {
      assert.deepStrictEqual(func(objects), objects);
    });

    it(`\`_.${methodName}\` should treat \`-0\` as \`0\``, () => {
      const actual = map(func([-0, 0]), toString);
      assert.deepStrictEqual(actual, ["0"]);
    });

    it(`\`_.${methodName}\` should match \`NaN\``, () => {
      assert.deepStrictEqual(func([NaN, NaN]), [NaN]);
    });

    it(`\`_.${methodName}\` should work with large arrays`, () => {
      const largeArray = [],
        expected = [0, {}, "a"],
        count = Math.ceil(LARGE_ARRAY_SIZE / expected.length);

      each(expected, (value) => {
        times(count, () => {
          largeArray.push(value);
        });
      });

      assert.deepStrictEqual(func(largeArray), expected);
    });

    it(`\`_.${methodName}\` should work with large arrays of \`-0\` as \`0\``, () => {
      const largeArray = times(LARGE_ARRAY_SIZE, (index) => isEven(index) ? -0 : 0);

      const actual = map(func(largeArray), toString);
      assert.deepStrictEqual(actual, ["0"]);
    });

    it(`\`_.${methodName}\` should work with large arrays of boolean, \`NaN\`, and nullish values`, () => {
      const largeArray = [],
        expected = [null, undefined, false, true, NaN],
        count = Math.ceil(LARGE_ARRAY_SIZE / expected.length);

      each(expected, (value) => {
        times(count, () => {
          largeArray.push(value);
        });
      });

      assert.deepStrictEqual(func(largeArray), expected);
    });

    it(`\`_.${methodName}\` should work with large arrays of symbols`, () => {
      if (Symbol) {
        const largeArray = times(LARGE_ARRAY_SIZE, Symbol);
        assert.deepStrictEqual(func(largeArray), largeArray);
      }
    });

    it(`\`_.${methodName}\` should work with large arrays of well-known symbols`, () => {
      // See http://www.ecma-international.org/ecma-262/6.0/#sec-well-known-symbols.
      if (Symbol) {
        let expected = [
          Symbol.hasInstance, Symbol.isConcatSpreadable, Symbol.iterator,
          Symbol.match, Symbol.replace, Symbol.search, Symbol.species,
          Symbol.split, Symbol.toPrimitive, Symbol.toStringTag, Symbol.unscopables
        ];

        const largeArray = [],
          count = Math.ceil(LARGE_ARRAY_SIZE / expected.length);

        expected = map(expected, (symbol) => symbol || {});

        each(expected, (value) => {
          times(count, () => {
            largeArray.push(value);
          });
        });

        assert.deepStrictEqual(func(largeArray), expected);
      }
    });

    it(`\`_.${methodName}\` should distinguish between numbers and numeric strings`, () => {
      const largeArray = [],
        expected = ["2", 2, Object("2"), Object(2)],
        count = Math.ceil(LARGE_ARRAY_SIZE / expected.length);

      each(expected, (value) => {
        times(count, () => {
          largeArray.push(value);
        });
      });

      assert.deepStrictEqual(func(largeArray), expected);
    });
  });
});
