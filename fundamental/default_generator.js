'use strict';

// When you run generatorFunction, you'll notice that the return value is an object
// and that's because a generator function creates and returns a generator object.
// Typically, the term generator refers to a generator object rather than a generator function.
// A generator object has a single function, next(). If you execute the generator object's next()
// function, you'll notice that console will print out `Hello, World!` to the screen.
// Notice that next() returned an object, { value: undefined, done: true }. The meaning of
// this object is tied to the `yield` keyword.
// generator().next();
module.exports = function* defaultGenerator() {
  let message = 'Hello';
  yield message;

  message += ', World!';
  yield message;
};

