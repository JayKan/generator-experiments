'use strict';

// Implement our own `thunkify`
module.exports = function thunkify(fn) {
  // `thunkify` returns a function that takes some arguments
  return function() {
    // the function gathers the arguments using for/of loops
    const args = [];
    for (const arg of arguments) {
      args.push(arg);
    }
    // and returns a thunk function
    return function(callback) {
      // The thunk calls the original function with your arguments
      // plus the callback
      return fn.apply(null, args.concat([callback]));
    }
  }
};