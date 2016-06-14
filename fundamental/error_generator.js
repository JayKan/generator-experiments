'use strict';

module.exports = function* errorGenerator() {
  throw new Error('oops!');
};