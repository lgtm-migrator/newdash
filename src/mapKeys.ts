import { PlainObject, CollectionIteratee, KeyIteratee } from './types';
import getIteratee from './.internal/getIteratee';
import baseForOwn from './.internal/baseForOwn';
import baseAssignValue from './.internal/baseAssignValue';


/**
 * The opposite of `mapValue` this method creates an object with the
 * same values as `object` and keys generated by running each own enumerable
 * string keyed property of `object` thru `iteratee`. The iteratee is invoked
 * with three arguments: (value, key, object).
 *
 * @since 5.11.0
 * @category Object
 * @param object The object to iterate over.
 * @param iteratee The function invoked per iteration.
 * @returns Returns the new mapped object.
 * @see [[mapValue]]
 * @example
 *
 * ```js
 * mapKey({ 'a': 1, 'b': 2 }, function(value, key) {
 *   return key + value
 * })
 * // => { 'a1': 1, 'b2': 2 }
 * ```
 */
export function mapKeys<T>(object: PlainObject<T>, iteratee: KeyIteratee): PlainObject
export function mapKeys<T>(object: PlainObject<T>, iteratee: CollectionIteratee<T>): PlainObject
export function mapKeys(object: any, iteratee: any): any {
  const result = {};
  iteratee = getIteratee(iteratee, 3);
  baseForOwn(object, (value, key, object) => {
    baseAssignValue(result, iteratee(value, key, object), value);
  });
  return result;
}

export default mapKeys;
