'use strict';

class Test {
  async(callback) {
    return callback(null, this);
  }
}

module.exports = Test;