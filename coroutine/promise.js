'use strict';

const promise = {
  then: function then(onFulfilled, onRejected) {
    setTimeout(() => onFulfilled('Hello, World from our constant promise!'), 0);
  }  
};

module.exports = promise; 