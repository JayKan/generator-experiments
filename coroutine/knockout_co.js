'use strict';

const utils = require('./utils');

// Real implementation of `Co` with added limitation implementation from fo.js
module.exports = function fo(input) {

  const isGenerator = utils.isGenerator;
  const isGeneratorFunction = utils.isGeneratorFunction;

  let generator;
  if (isGenerator(input)) generator = input;
  if (isGeneratorFunction(input)) generator = input();
  if (!generator) throw `Invalid parameter to fo() ${input}`;

  return new Promise((resolve, reject) => {
    next();

    // Call next() or throw() on the generator when it's necessary
    function next(v, isError) {
      let res;
      try {
        res = isError ? generator.throw(v) : generator.next(v);
      } catch(error) {
        return reject(error);
      }

      if (res.done) {
        return resolve(res);
      }
      
      toPromise(res.value).then(next, (error) => next(error, true));
    }

    // Covert v to a promise. If invalid, returns a rejected promise
    function toPromise(v) {
      if (isGeneratorFunction(v) || isGenerator(v)) return fo(v);
      if (v.then) return v;
      if (typeof v === 'function') {
        return new Promise((resolve, reject) => {
          v((error, res) => error ? reject(error) : resolve(res));
        });
      }
      if (Array.isArray(v)) return Promise.all(v.map(toPromise));
      return Promise.reject(new Error(`Invalid yield ${v}`));
    }
  });
};