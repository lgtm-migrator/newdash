/* eslint-disable no-undef */
import path from "path";
import { Hash } from "../src/.internal/Hash";
import identity from "../src/.internal/identity";
import ListCache from "../src/.internal/ListCache";
import root from "../src/.internal/root";
import Stack from "../src/.internal/Stack";
import attempt from "../src/attempt";
import filter from "../src/filter";
import forOwn from "../src/forOwn";
/** Load stable Lodash. */
import lodashStable from "../src/index";
import memoize from "../src/memoize";


/** Used to detect when a function becomes hot. */
const HOT_COUNT = 150;

/** Used as the size to cover large array optimizations. */
const LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
const FUNC_ERROR_TEXT = "Expected a function";

/** Used as the maximum memoize cache size. */
const MAX_MEMOIZE_SIZE = 500;

/** Used as references for various `Number` constants. */
const MAX_SAFE_INTEGER = 9007199254740991,
  MAX_INTEGER = 1.7976931348623157e+308;

/** Used as references for the maximum length and index of an array. */
const MAX_ARRAY_LENGTH = 4294967295,
  MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;

/** `Object#toString` result references. */
const funcTag = "[object Function]",
  numberTag = "[object Number]",
  objectTag = "[object Object]";

/** Used to store lodash to test for bad extensions/shims. */
const lodashBizarro = root.lodashBizarro;

/** Used for native method references. */
const arrayProto = Array.prototype,
  funcProto = Function.prototype,
  objectProto = Object.prototype,
  numberProto = Number.prototype,
  stringProto = String.prototype;

/** Method and object shortcuts. */
const phantom = root.phantom,
  process = root.process,
  amd = root.define ? define.amd : undefined,
  args = toArgs([1, 2, 3]),
  argv = process ? process.argv : undefined,
  defineProperty = Object.defineProperty,
  document = phantom ? undefined : root.document,
  body = root.document ? root.document.body : undefined,
  create = Object.create,
  fnToString = funcProto.toString,
  freeze = Object.freeze,
  getSymbols = Object.getOwnPropertySymbols,
  noop = function() { },
  objToString = objectProto.toString,
  params = argv,
  push = arrayProto.push,
  realm = {},
  slice = arrayProto.slice,
  strictArgs = (function() { "use strict"; return arguments; }(1, 2, 3));

const ArrayBuffer = root.ArrayBuffer,
  Buffer = root.Buffer,
  Map = root.Map,
  Promise = root.Promise,
  Proxy = root.Proxy,
  Set = root.Set,
  Symbol = root.Symbol,
  Uint8Array = root.Uint8Array,
  WeakMap = root.WeakMap,
  WeakSet = root.WeakSet;

const arrayBuffer = ArrayBuffer ? new ArrayBuffer(2) : undefined,
  map = Map ? new Map : undefined,
  promise = Promise ? Promise.resolve(1) : undefined,
  set = Set ? new Set : undefined,
  symbol = Symbol ? Symbol("a") : undefined,
  weakMap = WeakMap ? new WeakMap : undefined,
  weakSet = WeakSet ? new WeakSet : undefined;

/** Math helpers. */
const add = function(x, y) { return x + y; },
  doubled = function(n) { return n * 2; },
  isEven = function(n) { return n % 2 == 0; },
  square = function(n) { return n * n; };

/** Stub functions. */
const stubA = function() { return "a"; },
  stubB = function() { return "b"; },
  stubC = function() { return "c"; };

const stubTrue = function() { return true; },
  stubFalse = function() { return false; };

const stubNaN = function() { return NaN; },
  stubNull = function() { return null; };

const stubZero = function() { return 0; },
  stubOne = function() { return 1; },
  stubTwo = function() { return 2; },
  stubThree = function() { return 3; },
  stubFour = function() { return 4; };

const stubArray = function() { return []; },
  stubObject = function() { return {}; },
  stubString = function() { return ""; };

/** List of Latin Unicode letters. */
const burredLetters = [
  // Latin-1 Supplement letters.
  "\xc0", "\xc1", "\xc2", "\xc3", "\xc4", "\xc5", "\xc6", "\xc7", "\xc8", "\xc9", "\xca", "\xcb", "\xcc", "\xcd", "\xce", "\xcf",
  "\xd0", "\xd1", "\xd2", "\xd3", "\xd4", "\xd5", "\xd6", "\xd8", "\xd9", "\xda", "\xdb", "\xdc", "\xdd", "\xde", "\xdf",
  "\xe0", "\xe1", "\xe2", "\xe3", "\xe4", "\xe5", "\xe6", "\xe7", "\xe8", "\xe9", "\xea", "\xeb", "\xec", "\xed", "\xee", "\xef",
  "\xf0", "\xf1", "\xf2", "\xf3", "\xf4", "\xf5", "\xf6", "\xf8", "\xf9", "\xfa", "\xfb", "\xfc", "\xfd", "\xfe", "\xff",
  // Latin Extended-A letters.
  "\u0100", "\u0101", "\u0102", "\u0103", "\u0104", "\u0105", "\u0106", "\u0107", "\u0108", "\u0109", "\u010a", "\u010b", "\u010c", "\u010d", "\u010e", "\u010f",
  "\u0110", "\u0111", "\u0112", "\u0113", "\u0114", "\u0115", "\u0116", "\u0117", "\u0118", "\u0119", "\u011a", "\u011b", "\u011c", "\u011d", "\u011e", "\u011f",
  "\u0120", "\u0121", "\u0122", "\u0123", "\u0124", "\u0125", "\u0126", "\u0127", "\u0128", "\u0129", "\u012a", "\u012b", "\u012c", "\u012d", "\u012e", "\u012f",
  "\u0130", "\u0131", "\u0132", "\u0133", "\u0134", "\u0135", "\u0136", "\u0137", "\u0138", "\u0139", "\u013a", "\u013b", "\u013c", "\u013d", "\u013e", "\u013f",
  "\u0140", "\u0141", "\u0142", "\u0143", "\u0144", "\u0145", "\u0146", "\u0147", "\u0148", "\u0149", "\u014a", "\u014b", "\u014c", "\u014d", "\u014e", "\u014f",
  "\u0150", "\u0151", "\u0152", "\u0153", "\u0154", "\u0155", "\u0156", "\u0157", "\u0158", "\u0159", "\u015a", "\u015b", "\u015c", "\u015d", "\u015e", "\u015f",
  "\u0160", "\u0161", "\u0162", "\u0163", "\u0164", "\u0165", "\u0166", "\u0167", "\u0168", "\u0169", "\u016a", "\u016b", "\u016c", "\u016d", "\u016e", "\u016f",
  "\u0170", "\u0171", "\u0172", "\u0173", "\u0174", "\u0175", "\u0176", "\u0177", "\u0178", "\u0179", "\u017a", "\u017b", "\u017c", "\u017d", "\u017e", "\u017f"
];

/** List of combining diacritical marks. */
const comboMarks = [
  "\u0300", "\u0301", "\u0302", "\u0303", "\u0304", "\u0305", "\u0306", "\u0307", "\u0308", "\u0309", "\u030a", "\u030b", "\u030c", "\u030d", "\u030e", "\u030f",
  "\u0310", "\u0311", "\u0312", "\u0313", "\u0314", "\u0315", "\u0316", "\u0317", "\u0318", "\u0319", "\u031a", "\u031b", "\u031c", "\u031d", "\u031e", "\u031f",
  "\u0320", "\u0321", "\u0322", "\u0323", "\u0324", "\u0325", "\u0326", "\u0327", "\u0328", "\u0329", "\u032a", "\u032b", "\u032c", "\u032d", "\u032e", "\u032f",
  "\u0330", "\u0331", "\u0332", "\u0333", "\u0334", "\u0335", "\u0336", "\u0337", "\u0338", "\u0339", "\u033a", "\u033b", "\u033c", "\u033d", "\u033e", "\u033f",
  "\u0340", "\u0341", "\u0342", "\u0343", "\u0344", "\u0345", "\u0346", "\u0347", "\u0348", "\u0349", "\u034a", "\u034b", "\u034c", "\u034d", "\u034e", "\u034f",
  "\u0350", "\u0351", "\u0352", "\u0353", "\u0354", "\u0355", "\u0356", "\u0357", "\u0358", "\u0359", "\u035a", "\u035b", "\u035c", "\u035d", "\u035e", "\u035f",
  "\u0360", "\u0361", "\u0362", "\u0363", "\u0364", "\u0365", "\u0366", "\u0367", "\u0368", "\u0369", "\u036a", "\u036b", "\u036c", "\u036d", "\u036e", "\u036f",
  "\ufe20", "\ufe21", "\ufe22", "\ufe23"
];

/** List of converted Latin Unicode letters. */
const deburredLetters = [
  // Converted Latin-1 Supplement letters.
  "A", "A", "A", "A", "A", "A", "Ae", "C", "E", "E", "E", "E", "I", "I", "I",
  "I", "D", "N", "O", "O", "O", "O", "O", "O", "U", "U", "U", "U", "Y", "Th",
  "ss", "a", "a", "a", "a", "a", "a", "ae", "c", "e", "e", "e", "e", "i", "i", "i",
  "i", "d", "n", "o", "o", "o", "o", "o", "o", "u", "u", "u", "u", "y", "th", "y",
  // Converted Latin Extended-A letters.
  "A", "a", "A", "a", "A", "a", "C", "c", "C", "c", "C", "c", "C", "c",
  "D", "d", "D", "d", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e",
  "G", "g", "G", "g", "G", "g", "G", "g", "H", "h", "H", "h",
  "I", "i", "I", "i", "I", "i", "I", "i", "I", "i", "IJ", "ij", "J", "j",
  "K", "k", "k", "L", "l", "L", "l", "L", "l", "L", "l", "L", "l",
  "N", "n", "N", "n", "N", "n", "'n", "N", "n",
  "O", "o", "O", "o", "O", "o", "Oe", "oe",
  "R", "r", "R", "r", "R", "r", "S", "s", "S", "s", "S", "s", "S", "s",
  "T", "t", "T", "t", "T", "t",
  "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u",
  "W", "w", "Y", "y", "Y", "Z", "z", "Z", "z", "Z", "z", "s"
];

/** Used to provide falsey values to methods. */
const falsey = [, null, undefined, false, 0, NaN, ""];

/** Used to specify the emoji style glyph variant of characters. */
const emojiVar = "\ufe0f";

/** Used to provide empty values to methods. */
const empties = [[], {}].concat(falsey.slice(1));

/** Used to test error objects. */
const errors = [
  new Error,
  new EvalError,
  new RangeError,
  new ReferenceError,
  new SyntaxError,
  new TypeError,
  new URIError
];

/** List of fitzpatrick modifiers. */
const fitzModifiers = [
  "\ud83c\udffb",
  "\ud83c\udffc",
  "\ud83c\udffd",
  "\ud83c\udffe",
  "\ud83c\udfff"
];

/** Used to provide primitive values to methods. */
const primitives = [null, undefined, false, true, 1, NaN, "a"];

/** Used to check whether methods support typed arrays. */
const typedArrays = [
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array"
];

/** Used to check whether methods support array views. */
const arrayViews = typedArrays.concat("DataView");


/** The file path of the lodash file to test. */
const filePath = path.join(__dirname, "../src/index");

/** The `ui` object. */
const ui = root.ui || (root.ui = {
  "buildPath": filePath,
  "loaderPath": "",
  "isModularize": true,
  "isStrict": true,
  "urlParams": {}
});

/** The basename of the lodash file to test. */
const basename = /[\w.-]+$/.exec(filePath)[0];

/** Used to indicate testing a modularized build. */
const isModularize = ui.isModularize;

/** Detect if testing `npm` modules. */
const isNpm = isModularize && /\bnpm\b/.test([ui.buildPath, ui.urlParams.build]);

/** Detect if running in PhantomJS. */
const isPhantom = phantom || (typeof callPhantom === "function");

/** Detect if lodash is in strict mode. */
const isStrict = ui.isStrict;

/*--------------------------------------------------------------------------*/

// Leak to avoid sporadic `noglobals` fails on Edge in Sauce Labs.
root.msWDfn = undefined;

// Assign `setTimeout` to itself to avoid being flagged as a leak.
setProperty(root, "setTimeout", setTimeout);

/*--------------------------------------------------------------------------*/

/** Used to test Web Workers. */
const Worker = !(ui.isForeign || ui.isSauceLabs || isModularize) &&
  (document && document.origin != "null") && root.Worker;

/** Poison the free variable `root` in Node */
try {
  defineProperty(global.root, "root", {
    "configurable": false,
    "enumerable": false,
    "get": function() { throw new ReferenceError; }
  });
} catch (e) { }


/** The `lodash` function to test. */
const _ = root._ || (root._ = lodashStable);

/** Used to test pseudo private map caches. */
const mapCaches = (function() {
  const MapCache = memoize.Cache;
  const result = {
    Hash,
    MapCache,
    ListCache,
    Stack
  };
  return result;
}());

/** Used to detect instrumented istanbul code coverage runs. */
// var coverage = root.__coverage__ || root[lodashStable.find(lodashStable.keys(root), function(key) {
//   return /^(?:\$\$cov_\d+\$\$)$/.test(key);
// })];

/** Used to test async functions. */
const asyncFunc = attempt(() => Function("return async () => {}"));

/** Used to test generator functions. */
const genFunc = attempt(() => Function("return function*(){}"));

/** Used to restore the `_` reference. */
const oldDash = root._;

/**
 * Used to check for problems removing whitespace. For a whitespace reference,
 * see [V8's unit test](https://code.google.com/p/v8/source/browse/branches/bleeding_edge/test/mjsunit/whitespaces).
 */
const whitespace = filter([
  // Basic whitespace characters.
  " ", "\t", "\x0b", "\f", "\xa0", "\ufeff",

  // Line terminators.
  "\n", "\r", "\u2028", "\u2029",

  // Unicode category "Zs" space separators.
  "\u1680", "\u180e", "\u2000", "\u2001", "\u2002", "\u2003", "\u2004", "\u2005",
  "\u2006", "\u2007", "\u2008", "\u2009", "\u200a", "\u202f", "\u205f", "\u3000"
],
(chr) => /\s/.exec(chr))
  .join("");

/**
 * Creates a custom error object.
 *
 * @private
 * @constructor
 * @param {string} message The error message.
 */
function CustomError(message) {
  this.name = "CustomError";
  this.message = message;
}

CustomError.prototype = create(Error.prototype, {
  "constructor": CustomError
});

/**
 * Removes all own enumerable string keyed properties from a given object.
 *
 * @private
 * @param {Object} object The object to empty.
 */
function emptyObject(object) {
  forOwn(object, (value, key, object) => {
    delete object[key];
  });
}

/**
 * Extracts the unwrapped value from its wrapper.
 *
 * @private
 * @param {Object} wrapper The wrapper to unwrap.
 * @returns {*} Returns the unwrapped value.
 */
function getUnwrappedValue(wrapper) {
  let index = -1;
  const actions = wrapper.__actions__;
  const length = actions.length;
  let result = wrapper.__wrapped__;

  while (++index < length) {
    const args = [result],
      action = actions[index];

    push.apply(args, action.args);
    result = action.func.apply(action.thisArg, args);
  }
  return result;
}

/**
 * Sets a non-enumerable property value on `object`.
 *
 * Note: This function is used to avoid a bug in older versions of V8 where
 * overwriting non-enumerable built-ins makes them enumerable.
 * See https://code.google.com/p/v8/issues/detail?id=1623
 *
 * @private
 * @param {Object} object The object modify.
 * @param {string} key The name of the property to set.
 * @param {*} value The property value.
 */
function setProperty(object, key, value) {
  try {
    defineProperty(object, key, {
      "configurable": true,
      "enumerable": false,
      "writable": true,
      "value": value
    });
  } catch (e) {
    object[key] = value;
  }
  return object;
}

/**
 * Skips a given number of tests with a passing result.
 *
 * @private
 * @param {Object} assert The QUnit assert object.
 * @param {number} [count=1] The number of tests to skip.
 */
function skipAssert(assert, count) {
  count || (count = 1);
  while (count--) {
    assert.ok(true, "test skipped");
  }
}

/**
 * Converts `array` to an `arguments` object.
 *
 * @private
 * @param {Array} array The array to convert.
 * @returns {Object} Returns the converted `arguments` object.
 */
function toArgs(array) {
  return (function() { return arguments; }.apply(undefined, array));
}

export {
  HOT_COUNT,
  LARGE_ARRAY_SIZE,
  FUNC_ERROR_TEXT,
  MAX_MEMOIZE_SIZE,
  MAX_SAFE_INTEGER,
  MAX_INTEGER,
  MAX_ARRAY_LENGTH,
  MAX_ARRAY_INDEX,
  funcTag,
  numberTag,
  objectTag,
  lodashBizarro,
  arrayProto,
  funcProto,
  objectProto,
  numberProto,
  stringProto,
  phantom,
  amd,
  args,
  argv,
  defineProperty,
  document,
  body,
  create,
  fnToString,
  freeze,
  getSymbols,
  identity,
  noop,
  objToString,
  params,
  push,
  realm,
  root,
  slice,
  strictArgs,
  arrayBuffer,
  map,
  promise,
  set,
  symbol,
  weakMap,
  weakSet,
  add,
  doubled,
  isEven,
  square,
  stubA,
  stubB,
  stubC,
  stubTrue,
  stubFalse,
  stubNaN,
  stubNull,
  stubZero,
  stubOne,
  stubTwo,
  stubThree,
  stubFour,
  stubArray,
  stubObject,
  stubString,
  burredLetters,
  comboMarks,
  deburredLetters,
  falsey,
  emojiVar,
  empties,
  errors,
  fitzModifiers,
  primitives,
  typedArrays,
  arrayViews,
  filePath,
  ui,
  basename,
  isModularize,
  isNpm,
  isPhantom,
  isStrict,
  Worker,
  lodashStable,
  _,
  mapCaches,
  // coverage,
  asyncFunc,
  genFunc,
  oldDash,
  whitespace,
  CustomError,
  emptyObject,
  getUnwrappedValue,
  setProperty,
  skipAssert,
  toArgs
};
