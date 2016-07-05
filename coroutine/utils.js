'use strict';

const isGenerator = (v) => typeof v.next === 'function';
const isGeneratorFunction = (v) => v.constructor && v.constructor.name === 'GeneratorFunction';

module.exports = {
  isGenerator: isGenerator,
  isGeneratorFunction: isGeneratorFunction 
};