'use strict';

const assert = require('chai').assert;
const defaultGeneratorFunction = require('../fundamental/default_generator');
const retryGenerator = require('../fundamental/retry_generator');
const errorGenerator = require('../fundamental/error_generator');

describe('Generator Fundamental Unit Tests', () => {
  
  describe('1: default_generator', () => {
    it('should only have 2 yielded values', () => {
      // get generator ready to run
      const generator = defaultGeneratorFunction();

      // 1st yielded value
      const v1 = generator.next();
      assert.deepEqual(v1, { value: 'Hello', done: false });

      // 2nd yielded value
      const v2 = generator.next();
      assert.deepEqual(v2, { value: 'Hello, World!', done: false });

      // 3rd yielded value should be undefined.
      const v3 = generator.next();
      assert.deepEqual(v3, { value: undefined, done: true });
    });
  });

  describe('2: retry_generator', () => {
    it('retry_generator should only yielded 3 values', (done) => {

      // get generator ready to run
      const generator = retryGenerator();

      // 1st yielded value
      let x = generator.next();
      assert.deepEqual(x, { value: 0, done: false });

      setTimeout(() => {
        // 2nd yielded value
        x = generator.next();
        assert.deepEqual(x, { value: 1, done: false });

        // 3rd yielded value
        x = generator.next();
        assert.deepEqual(x, { value: 2, done: false });

        // 4th yielded value should be undefined
        x = generator.next();
        assert.deepEqual(x, { value: undefined, done: true });
        done();
      }, 50);
    });
  });

  /**
   * You may be wondering what happens when you use `return`
   * instead of `yield` in a generator. As you might expect,
   * `return` behaves similarly to `yield`, except for
   * `done` is set to true.
   */
  describe('3: The difference between `yield` vs. `return` within generator functions', () => {
    it('`yield` vs `return` revisited. `Return` should only return one value.', () => {
      const generatorFunction = function*() {
        return 'Hello, World!';
      };
      const generator = generatorFunction();
      // 1st yielded value
      const v1 = generator.next();
      assert.deepEqual(v1, { value: 'Hello, World!', done: true });

      // 2nd yielded value should have value === undefined
      const v2 = generator.next();
      assert.deepEqual(v2, { value: undefined, done: true });
    });
  });
  
  describe('4: Error handling using throw', () => {
    it('should throw an error', () => {
      const generator = errorGenerator();

      assert.throws(function() {
        // throws an error
        generator.next();
      });
    });
  });
  
  describe('5: Error handing asynchronously', () => {

    describe('5.1: generator.next() can take a parameter and sets its return value', () => {
      it('can take a parameter and sets the return value of the yield statement', () => {
        const generatorFunction = function* generatorFunction() {
          // yield sits in between the yielded value (right) and the parameter value passed in (left)
          const fullName = yield ['John', 'Smith'];
          assert.equal(fullName, 'John, Smith');

          yield fullName;
        };
        const generator = generatorFunction();

        // 1st yielded value
        const v1 = generator.next(); // { value: ['John', 'Smith'], done: false }

        // 2nd yielded value
        const v2 = generator.next(v1.value.join(', ')); // { value: 'John, Smith', done: false }
        assert.deepEqual(v2, { value: 'John, Smith', done: false });

        // 3rd yielded value should be undefined
        const v3 = generator.next();
        assert.deepEqual(v3, { value: undefined, done: true });
      });
    });

    describe('5.2: yield an asynchronous function from generator and return success value', () => {
      it('should pass the correct response to async callback', (done) => {
        const async = (callback) => setTimeout(() => callback(null, 'Hello, Async!'), 10);
        const generatorFunction = function* generatorFunction() {
          const v = yield async;
          assert.equal(v, 'Hello, Async!');
        };
        const generator = generatorFunction();

        // 1st yielded value as an async function
        const v1 = generator.next();
        v1.value(function(error, res) {
          // set const v value
          generator.next(res);
          done();
        });
      });
    });

    describe('5.3: yield an asynchronous function from generator and handling async errors', () => {
      it('should throw the correct async errors', (done) => {
        const async = (callback) => setTimeout(() => callback(new Error('Oops!')), 10);
        const generatorFunction = function* generatorFunction() {
          try {
            yield async;
            assert.ok(false);
          } catch(error) {
            assert.equal(error.toString(), 'Error: Oops!');
          }
        };
        const generator = generatorFunction();

        // 1st yielded value which is an async callback function
        const v1 = generator.next();
        v1.value(function(error, res) {
          if (error) {
            generator.throw(error);
            done();
          }
        });
      });
    });
  });
});