# Generators Fundamental

### Background 
Generators are far from a new programming construct - they first appeared in 1975 and Python has had them since Python 2.2 in 2001. A **generator** function creates and returns a **generator object**. Typically, the term generator refers to a generator object rather than a generator function. A generator object has a single function, `next()`.

### Yield vs. Return
The `yield` keyword can be thought of as a `return` that allows **re-entry**. In other words, once return executes, the currently executing function is done **forever**. However, when you call `generator.next()`, the JavaScript interpreter executes the generator function **until** the first **yield** statement. When you invoke `generator.next()` again, the generator function picks up where it left off. In short, you can think of a generator function that **can** return multiple values.

```javascript
const generatorFunction = function*() {
  let message = 'Hello';
  yield message;
  
  message += ', World!';
  yield message;
};    
const generator = generatorFunction()
// { value: 'Hello', done: false }
const v1 = generator.next();
// { value: 'Hello, World!', done: false }
const v2 = generator.next();
// { value: undefined, done: true }
const v3 = generator.next()
```

### Re-entry
The most import detail from the above example is that, when **`yield`** executes, the generator function **stops** executing until the **next** time you invoke `generator.next()`. (**NOTE**: You can invoke `generator.next()` whenever you want, even in a `setTimeout()`. The JavaScript interpreter will **re-enter** the generator function with the **same state** that it left off with.)

```javascript
const generatorFunction = function*() {
  let i = 0;
  while (i < 3) {
    yield i;
    ++i;
  }
};

const generator = generatorFunction();
let x = generator.next(); // { value: 0, done: false }
setTimeout(() => {
  x = generator.next(); // { value: 1, done: false }
  x = generator.next(); // { value: 2, done: false }
  x = generator.next(); // { value: undefined, done: true }
}, 50);

```
