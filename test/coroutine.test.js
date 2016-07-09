'use strict';

const assert = require('chai').assert;
const co = require('co');
const superagent = require('superagent');
const thunkify = require('thunkify');

describe('Asynchronous Coroutines Unit Tests', () => {
  describe('1. Yield `superagent` using co', () => {
    it('should fetch google home page', (done) => {
      co(function*() {
        const html = (yield superagent.get('http://www.google.com')).text;
        if (html) {
          assert.ok(html);
          done();
        }
      });
    });
  });
  
  describe('2. Yield `thunks` using co', () => {
    it('should behaves the same as above', (done) => {
      co(function*() {
        // `thunkify` takes a single parameter, an asynchronous function, and returns a function
        // that returns a thunk
        const thunk = thunkify(superagent.get)('http://www.google.com');
        
        assert.equal(typeof thunk, 'function');
        // A function's length property contains the number of parameters
        assert.equal(thunk.length, 1);
        
        const html = yield thunk;
        if (html) {
          assert.ok(html);
          done();
        }
      }).catch(error => done(error));
    });
  });

  describe('3. Implement our own `thunkify`', () => {
    it('should behaves the same as if we were using npm `thunkify` dependency', (done) => {
      // our own implementation of `thunkify`
      const myThunkify = require('../coroutine/thunkify_implementation');

      co(function*() {
        const thunk = myThunkify(superagent.get)('http://www.google.com');

        assert.equal(typeof thunk, 'function');
        assert.equal(thunk.length, 1); // A function's length property contains the number of parameters

        // 1st yielded value
        const html = yield thunk;

        if (html) {
          assert.ok(html);
          done();
        }
      });
    });
  });

  describe('4: How `thunkify` loses its value of this dealing with a Class', () => {
    it('should not equal to the same response', (done) => {
      let Test = require('../coroutine/test');

      co(function*() {
        const test = new Test();
        const res = yield thunkify(test.async)();
        // Woops, res refers to the global object rather than the `test` variable
        assert.ok(res !== test);
        done();
      });
    });
  });

  describe('5: Fix `thunkify` losses `this` value from above 4 using bind() to have chained function calls', () => {
    it('should bind to the correct this', (done) => {
      let Test = require('../coroutine/test');

      co(function*() {
        const test = new Test();
        // using bind() to have chained function calls.
        const res = yield thunkify(test.async.bind(test))();
        assert.ok(res === test);
        done();
      });
    });
  });

  describe('6: Yield `Promises` using co', () => {
    it('should yield the correct promise result', (done) => {
      let promise = require('../coroutine/promise');

      co(function*() {
        // 1st yielded value as a promise result
        const v1 = yield promise;
        if (v1) {
          assert.equal(v1, 'Hello, World from our constant promise!');
          done();
        }
      });
    });
  });

  describe('7: Test our own implementation of `Co`', () => {
    it('should yield the same response as if we were using the `Co` library', (done) => {
      // our own implementation of `Co` lib
      let fo = require('../coroutine/fo');

      fo(function*() {
        const html = (yield superagent.get('http://www.google.com')).text;
        if (html) {
          assert.ok(html);
          done();
        }
      });
    });
  });

  describe('8: Test our `Fo` implementation with handling errors', () => {
    it('should handle simple errors', (done) => {
      // our own implementation of `Co` lib
      let fo = require('../coroutine/fo');

      fo(function*() {
        try {
          // 1st yielded value iteration of `next()` stops here
          const res = yield superagent.get('http://doesnot.exist.baddomain');
          if (!res) {
            assert.ok(false);
          }
        } catch(error) {
          // The promise was rejected, so fo calls `generator.throw` and
          // you end up here.
          // console.log('Error: ', error.toString());
        }

        // 2nd iteration of `next()` stops here, `.then()` on the promise
        const res = yield superagent.get('http://www.google.com');
        if (res) {
          assert.ok(res.text);
          done();
        }
      });
    });
  });

  describe('9: Test our `Fo` implementation with retrying failed HTTP requests', () => {
    it('should retry failed HTTP requests 3 times and it should rendered `undefined` for the yield response', (done) => {
      // our own implementation of `Co` lib
      let fo = require('../coroutine/fo');

      fo(function*() {
        const URL = 'http://doesnot.exit.baddomain';
        const NUM_RETRIES = 3;
        let res;
        for (let i = 0; i < NUM_RETRIES; i+=1) {
          try {
            // Going to yield 3 times, and `fo()` will call `generator.throw()`
            // 3 times because superagent will fail every time
            res = yield superagent.get(URL);
            break;
          } catch(error) { /* retry goes here */ }
        }
        // res is undefined - retried 3 times with no results
        assert.equal(res, undefined);
        done();
      });
    });
  });
  
  describe('10: Test our enhanced `Fo` implementation with helper function', () => {
    it('should helper generator function get() to `yield`', (done) => {
      const knockoutCo = require('../coroutine/knockout_co');
      const get = function*() {
        return (yield superagent.get('http://www.google.com')).text;
      };

      knockoutCo(function*() {
        const html = yield get();
        if (html) {
          assert.ok(html);
          done();
        }
      }).catch(error => done(error));
    });
  });

  describe('11: Test our enhanced `knockout_co` implementation with throwing errors', () => {
    it('should catch the error from `knock_co`.catch() callback', (done) => {
      const knockoutCo = require('../coroutine/knockout_co');

      knockoutCo(function*() {
        const html = yield superagent.get('http://www.google.com');
        // Throws a TypeError since `html.notARealProperty` is undefined
        const v = html.notARealProperty.test;
        if (!v) {
          assert.ok(false);
        }
      }).catch(error => {
        assert.ok(error);
        done();
      });
    });
  });

  describe('12: Test our enhanced `knockout_co` implementation with multiple parallel asynchronous requests', () => {
    it('should handle multiple parallel requests before `yield` values', (done) => {
      const knockoutCo = require('../coroutine/knockout_co');

      knockoutCo(function*() {
        const google = superagent.get('http://www.google.com');
        const amazon = superagent.get('http://www.amazon.com');
        // Parallel HTTP requests
        const res = yield [google, amazon];
        assert.ok(res[0]);
        assert.ok(res[1]);
        done();
      }).catch(error => done(error));
    });
  });

  describe('13: Test our enhanced `knockout_co` implementation with multiple parallel asynchronous requests plus throwing errors', () => {
    it('should handle errors during multiple parallel HTTP requests', (done) => {
      const knockoutCo = require('../coroutine/knockout_co');

      knockoutCo(function*() {
        const google = superagent.get('http://www.google.com');
        const amazon = superagent.get('http://www.amazon.com');
        const fake   = superagent.get('http://doesnot.exit.baddomain');
        const res    = yield [google, amazon, fake];

        assert.ok(res[0]);
        assert.ok(res[1]);
        assert.ok(res[2]);
        done();
      }).catch(error => {
        assert.ok(error);
        done();
      });
    });
  });

});