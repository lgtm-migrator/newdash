// @ts-nocheck
import isArray from "./isArray";
import isIterateeCall from "./.internal/isIterateeCall";
import getIteratee from "./.internal/getIteratee";
import baseEach from "./.internal/baseEach";

/**
 * A specialized version of `some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param array The array to iterate over.
 * @param predicate The function invoked per iteration.
 * @returns Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  let index = -1;
  const length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}


/**
 * The base implementation of `some` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function baseSome(collection, predicate) {
  let result;
  baseEach(collection, (value, index, collection) => {
    result = predicate(value, index, collection);
    return !result;
  });
  return !!result;
}


/**
 * Checks if `predicate` returns truthy for **any** element of `collection`.
 * Iteration is stopped once `predicate` returns truthy. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * @since 5.2.0
 * @category Collection
 * @param collection The collection to iterate over.
 * @param predicate The function invoked per iteration.
 * @param guard Enables use as an iteratee for methods like `map`.
 * @returns Returns `true` if any element passes the predicate check,
 *  else `false`.
 * @example
 *
 * some([null, 0, 'yes', false], Boolean);
 * // => true
 *
 * var users = [
 *   { 'user': 'barney', 'active': true },
 *   { 'user': 'fred',   'active': false }
 * ];
 *
 * // The `matches` iteratee shorthand.
 * some(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `matchesProperty` iteratee shorthand.
 * some(users, ['active', false]);
 * // => true
 *
 * // The `property` iteratee shorthand.
 * some(users, 'active');
 * // => true
 */
export function some<T>(collection: ArrayLike<T>, predicate?: any, guard?: any): boolean;
export function some(collection: any, predicate?: any, guard?: any): boolean {
  const func = isArray(collection) ? arraySome : baseSome;
  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }
  return func(collection, getIteratee(predicate, 3));
}

export default some;
