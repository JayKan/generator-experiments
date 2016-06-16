'use strict';

const assert = require('chai').assert;
const fibonacciGenerator = require('../fibonacci/fibonacci_generator');

describe('Async Fibonacci Generator Unit Tests', () => {
  describe('Compute the 10th fibonacci number', () => {
    describe('1: compute synchronously', () => {
      it('should equal to 55 (10th fibonacci number) via for/loops', function() {
        const generator = fibonacciGenerator(10);
        let it;
        // compute the fibonacci number synchronously via for loops
        for (it = generator.next(); !it.done; it = generator.next()) {}
        let result = it.value; // 55, the 10th fibonacci number
        assert.equal(result, 55);
      });
    });

    describe('2: compute asynchronously', () => {
      it('should also equal to 55 (10th fibonacci number) via each iteration of the event loop', (done) => {
        const generator = fibonacciGenerator(10);

        // compute the fibonacci number asynchronously with each iteration through the event loop
        const interval = setInterval(() => {
          const response = generator.next();
          if (response.done) {
            clearInterval(interval);
            let value = response.value; // 55, the 10th fibonacci number
            assert.equal(value, 55);
            done();
          }
        }, 0);
      });
    });

    describe('3: compute using For/Of loops', () => {
      it('should also equal to 55 (10th fibonacci number) via using For/Of loops', () => {
        const generator = fibonacciGenerator(10);

        let p1 = 0;
        let p2 = 1;

        for (const x of generator) {
          x; // 1, 1, 2, 3, 5, ..., 55
          assert.equal(p1 + p2, x);
          p1 = p2;
          p2 = x;
        }
      });
    });

    describe('4: compute using iterable pattern', () => {
      it('should also equal to 55 (10th fibonacci number) via the `iterable` pattern [Symbol.iterator]', () => {
        let iterable = {};
        // [Symbol.iterator] should returns the generator itself
        iterable[Symbol.iterator] = function() {
          return fibonacciGenerator(10);
        };

        let p1 = 0;
        let p2 = 1;

        for (const x of iterable) {
          x; // 1, 1, 2, 3, 5, ..., 55
          assert.equal(p1 + p2, x);
          p1 = p2;
          p2 = x;
        }

      })
    });
  });

  describe('Error handling', () => {
    describe('1. Re-entry with error', () => {
      it('should throw an error', () => {
        const fakeFibonacciGenerator = function* fakeFibonacciGenerator() {
          try {
            yield 3;
            assert.ok(false);
          } catch(error) {
            assert.equal(error.toString(), 'Error: Expected 1, got 3');
          }
        };
        const generator = fakeFibonacciGenerator();

        // 1st yielded value
        const v1 = generator.next();
        generator.throw(new Error(`Expected 1, got ${v1.value}`));

        const v2 = generator.next(); // { value: undefined, done: true }
        assert.deepEqual(v2, { value: undefined, done: true });
      });
    });
  });
});