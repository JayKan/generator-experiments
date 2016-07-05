'use strict';

let co = require('co');
let superagent = require('superagent');

co(function*() {
  // HTML for Google's home page
  const html = (yield superagent.get('http://www.google.com')).text;
});

// Promises and Thunks 
// 1) What sort of asynchronous operations can you yield to `co`?
