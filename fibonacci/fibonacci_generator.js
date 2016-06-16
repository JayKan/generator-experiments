'use strict';

module.exports = function* fibonacciGenerator(n) {
  let back2 = 0;
  let back1 = 1;
  let cur   = 1;
  for (let i = 0, ii = n -1; i < ii; i+=1) {
    cur = back2 + back1;
    back2 = back1;
    back1 = cur;
    yield cur;
  }
  return cur;
};
