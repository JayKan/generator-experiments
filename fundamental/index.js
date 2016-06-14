'use strict';

let defaultGeneratorFunction = require('./default_generator');
let retryGeneratorFunction = require('./retry_generator');

/*
 Below code shows, when "yield" executes, and it can be executed as many times as ...yield.
 The generator function stops executing until the next time you call generator.next()
 
 The yield keyword can be thought of as a `return` that allows re-entry
 */
const defaultGenerator = defaultGeneratorFunction();
let v1 = defaultGenerator.next(); // { value: 'Hello',         done: false }
let v2 = defaultGenerator.next(); // { value: 'Hello, World!', done: false }
let v3 = defaultGenerator.next(); // { value: undefined,       done: true  }


const retryGenerator = retryGeneratorFunction();
let x = retryGenerator.next(); // { value: 0, done: false       }
setTimeout(() => {
  x = retryGenerator.next();  // { value: 1, done: false        }
  x = retryGenerator.next();  // { value: 2, done: false        }
  x = retryGenerator.next();  // { value: undefined, done: true }
}, 50);