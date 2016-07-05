'use strict';

// Our own implementation of `Co`, which we called `fo`
// Limitations of our current implementation:
// 1) Catching uncaught errors in the generator
// 2) Ability to use helper functions that yield.
// 3) Does not follow parallelism
module.exports = function fo(generatorFunction) {
  // 1st: create a generator from the provided generator function
  const generator = generatorFunction();

  // 2nd: kick off the generator's execution by invoking next() function
  // next() function calls generator.next() to start off the generator
  next();

  // Call next() or throw() on the generator as necessary
  function next(v, isError) {
    const res = isError ? generator.throw(v) : generator.next(v);
    if (res.done) {
      return;
    }
    handleAsync(res.value);
  }
  
  // Handle the result the generator yielded
  function handleAsync(async) {
    if (async && async.then) {
      handlePromise(async);
    } else if (typeof async === 'function') {
      handleThunk(async);
    } else {
      next(new Error(`Invalid yield ${async}`), true);
    }
  }

  // Handle promise
  function handlePromise(async) {
    async.then(next, (error) => next(error, true));
  }
  
  // Handle thunk
  function handleThunk(async) {
    async((error, v) => {
      error ? next(error, true): next(v);
    });
  }
};