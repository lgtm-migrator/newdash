import getTag from "./.internal/getTag";
import isObjectLike from "./isObjectLike";


/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @since 5.5.0
 * @category Lang
 * @param value The value to check.
 * @returns Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * ```js
 * isSet(new Set)
 * // => true
 *
 * isSet(new WeakSet)
 * // => false
 * ```
 */
export function isSet(value: any): value is Set<any> {
  return isObjectLike(value) && getTag(value) == "[object Set]";
};

export default isSet;
