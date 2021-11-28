// @ts-nocheck
import baseClone from "./.internal/baseClone";
import baseMatchesProperty from "./.internal/baseMatchesProperty";
import { Path } from "./types";

/** Used to compose bitmasks for cloning. */
const CLONE_DEEP_FLAG = 1;

/**
 * Creates a function that performs a partial deep comparison between the
 * value at `path` of a given object to `srcValue`, returning `true` if the
 * object value is equivalent, else `false`.
 *
 * **Note:** Partial comparisons will match empty array and empty object
 * `srcValue` values against any array or object value, respectively. See
 * `isEqual` for a list of supported value comparisons.
 *
 * @since 5.11.0
 * @category Util
 * @param path The path of the property to get.
 * @param srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 * @example
 *
 * ```js
 * const objects = [
 *   { 'a': 1, 'b': 2, 'c': 3 },
 *   { 'a': 4, 'b': 5, 'c': 6 }
 * ]
 *
 * find(objects, matchesProperty('a', 4))
 * // => { 'a': 4, 'b': 5, 'c': 6 }
 * ```
 */
export function matchesProperty(path: Path, srcValue: any): (object: any) => boolean {
  return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
}

export default matchesProperty;
