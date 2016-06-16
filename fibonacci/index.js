'use strict';

let fibonacciGenerator = require('./fibonacci_generator');

// Compute the 10th Fibonacci number synchronously using the above `fibonacciGenerator`.
const fibonacci = fibonacciGenerator(10);
let result;
for (result = fibonacci.next(); !result.done; result = fibonacci.next()) {}
let calculation = result.value; // 55, the 10th fibonacci number
console.log('Calculation: ', calculation);


// Compute a very large Fibonacci number without blocking the event loop.
// Without generators, breaking up a long-running calculation can be cumbersome.
// However, since we have a generator function that yields after each iteration of
// the for loop, we can invoke `generator.next()` in a `setInterval()` function.
// This will compute the next Fibonacci number with each iteration of the event loop,
// so it won't prevent Node.js from responding from incoming requests. Let's make our
// Fibonacci calculation `asynchronous` without changing our initial generator function.
const fibonacci_2 = fibonacciGenerator(10);

// Now we can compute the new Fibonacci number with each iteration through the event loop.
const interval = setInterval(() => {
  const response = fibonacci_2.next();
  if (response.done) {
    clearInterval(interval);
    return response.value; // 55, the 10th fibonacci number
  }
}, 0);


// Iterators && Iterables example
let iterable = {};
// for (const x of iterable) {}
// But once you add a `Symbol.iterator` property everything should be working fine,
iterable[Symbol.iterator] = function() {
  return fibonacciGenerator(10);
};

for (const x of iterable) {
  x; // 1, 1, 2, 3, 5, ..., 55
  // console.log(x);
}

const fibonacci_3 = fibonacciGenerator(10);
for (const x of fibonacci_3) {
  // 1, 1, 2, 3, 5, ... 55
  // console.log('Run here: ', x);
}
for (const x of fibonacci_3) {
  // done's run
  console.log('Does not run here?');
}


const anotherGeneratorFunction = function*() {
  throw new Error('Oops there is an error!');
};
const anotherGenerator = anotherGeneratorFunction();

setTimeout(() => {
  try { 
    // anotherGenerator.next();
  } catch (error) {
    /**
     * Error: Oops there is an error!
     */
    console.log('Catching error here: ', error.stack);
    return error.stack;
  }
}, 0);


const fakeFibonacciGenerator = function* fakeFibonacciGenerator() {
  try {
    yield 3;
  } catch(error) {
    return error; // Error: Expected 1, got 3.
  }
};

const fakeFibonacci = fakeFibonacciGenerator();
const x = fakeFibonacci.next();
fakeFibonacci.throw(new Error(`Expected 1, got ${x.value}`));
// { value: undefined, done: true }
let fakeValue = fakeFibonacci.next();


const generatorFunction = function* generatorFunction() {
  const fullName = yield ['Jay', 'Kan'];
  // console.log('3: fullName: ', fullName);
};

const generator = generatorFunction();
// Execute up to the first `yield`
const next = generator.next();
// console.log('1: Next: ', next.value);
const nextValue = generator.next(next.value.join(' '));
// console.log('2: nextValue: ', nextValue);

const async = function(callback) {
  // setTimeout(() => callback(null, 'Hello, Async!'), 10);
  setTimeout(() => callback(new Error('Oops!')), 10);
};

const asyncGeneratorFunction = function* asyncGeneratorFunction() {
  // const v = yield async;
  // console.log('Aysnc value: ', v);
  try {
    yield async;
  } catch (error) {
    console.log('Error: ', error);
    return error;
  }
};

const asyncGenerator = asyncGeneratorFunction();
const res = asyncGenerator.next();
console.log("Initial Res: ", res);
res.value(function(error, response) {
  asyncGenerator.throw(error);
});
