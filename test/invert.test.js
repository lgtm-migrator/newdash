import * as assert from 'assert';
import invert from '../src/invert';

describe('invert', () => {

  it('should invert an object', () => {
    const object = { 'a': 1, 'b': 2 },
      actual = invert(object);

    assert.deepStrictEqual(actual, { '1': 'a', '2': 'b' });
    assert.deepStrictEqual(invert(actual), { 'a': '1', 'b': '2' });
  });

  it('should work with values that shadow keys on `Object.prototype`', () => {
    const object = { 'a': 'hasOwnProperty', 'b': 'constructor' };
    assert.deepStrictEqual(invert(object), { 'hasOwnProperty': 'a', 'constructor': 'b' });
  });

  it('should work with an object that has a `length` property', () => {
    const object = { '0': 'a', '1': 'b', 'length': 2 };
    assert.deepStrictEqual(invert(object), { 'a': '0', 'b': '1', '2': 'length' });
  });

});
