# Transpiling

### Dependencies
[Regenerator](https://www.npmjs.com/package/regenerator) - Facebook's open-source transpiler for transforming generator functions into ES5.
[Esprima](https://www.npmjs.com/package/esprima) - is a high performance, standard-compliant ECMAScript parser.
[Estraverse](https://www.npmjs.com/package/estraverse) - is ECMAScript traversal functions from [esmangle project](https://github.com/estools/esmangle).


### Introducing Regenerator
Regenerator is a *transpiler*: it takes some JavaScript code as a string, and produces some equivalent JavaScript code as string. **Two key questions** keep in mind when trying to understand how a *transpiler* works are:

1. What code do you want to transform?
2. What do you wan to transform the code into?

In regenerator's case, the first question is simple: we want to transform every generator function `function*(){}` and every `yield` statement **within** a generator function. The second question is more subtle since the ES2015 spec defines a generator solely in terms of which properties it has. In other words, any JavaScript object with a `next()` and a `throw()` properties is a generator. As far as ES2015 spec considers the **ONLY** two properties necessary for an object to be considered as a generator are `next()` and `throw()` properties. With this said, the idea behind regenerator is quite simple: convert a *generator function* into a regular function that returns an object that fulfills the ES2015 generator API.

The idea behind writing *generator functions* in **ES5** is that a **generator** can be thought of as a series of function calls that return values. The main difference between `yield` and `return` is that you can't resume a function after `return` has been called. Therefore, in order to build a generator function out of normal functions, you need **multiple** function calls. `Regenerator` handles this by creating a function that gets a parameter which defines which step the generator is on. A step **ends** with a `return` statement, or a `yield` statement, which is transformed into a `return`. You can think of a generator as being on the x-th step if there have been x yield statements.

For instance, suppose you have the below generator function:

```javascript
const generatorFunction = function*() {
  return (yield superagent.get('http://www.google.com')).text;
};
```

The above generator function has **2** steps:
1. superagent.get('http://www.google.com').
2. return the text property from the value that `generator.next()` gives you.






