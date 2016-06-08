# ES2015 Generators

### Getting Started

[The notion of generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) is a groundbreaking new feature in [ES2015](https://babeljs.io/docs/learn-es2015/), one of the few that isn't trivial to implement using the old ES5 spec. Specifically, generators help you write asynchronous code **without** callbacks, calculate the billionth Fibonacci number *without blocking the event loop*, and write web servers that actually know when they're done writing the HTTP response.

The ES2015 spec defines a generator solely in terms of which properties it has. In other words, any JavaScript object can be a *generator*, Any JavaScript object with a `next()` function and a `throw()` function is a generator as far as `co` is concerned.

Generators simplify iterator-authoring using **function*** and **yield**. A function declared as `function*` returns a **generator** instance. Furthermore, generators are **subtypes** of **iterators** which include additional **next** and **throw**. These enable values to flow back into the generator, so **yield** is an expression form which returns a value (or throws).