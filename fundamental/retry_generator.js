'use strict';

module.exports = function* retryGenerator() {
  let i = 0;
  while (i < 3) {
    yield i;
    i+=1;
  }
};

