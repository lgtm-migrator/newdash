import words from "./words";
import toString from "./toString";

/**
 * Converts `string` to
 * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
 *
 * @since 5.6.0
 * @category String
 * @param string The string to convert.
 * @returns Returns the kebab cased string.
 * @see camelCase, lowerCase, snakeCase, startCase, upperCase, upperFirst
 * @example
 *
 * ```js
 * kebabCase('Foo Bar')
 * // => 'foo-bar'
 *
 * kebabCase('fooBar')
 * // => 'foo-bar'
 *
 * kebabCase('__FOO_BAR__')
 * // => 'foo-bar'
 * ```
 */
export function kebabCase(string: string): string {
  return words(toString(string).replace(/['\u2019]/g, "")).reduce((result, word, index) => (
    result + (index ? "-" : "") + word.toLowerCase()
  ), "");
}

export default kebabCase;
