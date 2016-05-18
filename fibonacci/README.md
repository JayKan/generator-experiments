# Exploring Async Fibonacci Sequence

### For/Of Loops
Remember the for loop you saw for exhausting the Fibonacci generator?

```javascript
for (result = fibonacci.next(); !result.done; result = fibonacci.next()) {}
```

This **`for loop`** is a perfectly reasonable way of going through every value of the generator. However, ES2015 introduces a much **cleaner** mechanism for looping through generators: the **`for-of`** loop.

```javascript
let fibonacci = fibonacciGenerator(10);
for (const x of fibonacci) {
  x; // 1, 1, 2, 3, 5, ..., 55
}
```

### Iterators and Iterables

Since a **generator** is actually an instance of a more general ES2015 concept called an **iterator**. An **iterator** is any JavaScript object that has a `next()` function that returns `{ value: Any, done: Boolean}`. A generator is one example of an iterator. As you can see, you can iterator over arrays:

```javascript
for (const x of [1, 2, 3]) {
  x; // 1, 2, 3
}
```

However, **For/Of loops** don't operate on `iterators`, they only operate on iterables. An **iterable** is an object that has a `Symbol.iterator` property which is a function that returns an **iterator**. In other words, when you execute a `For/Of` loop, the JavaScript interpreter looks for a `Symbol.iterator` property on the object you're looping **of**.

### Overview of Symbols

**Symbols** are another new feature in ES2015. You can think of a symbol as a **unique identifier** for a key on an object. Symbols protect you from the issue of accidental string collision. (**NOTE**: no string key is equal to `Symbol.iterator`, so you don't have to worry about accidentally breaking an iterable). Furthermore, **symbols** don't appear in the output of `Object.keys()`.
 
```javascript
Symbol.iterator; // Symbol(Symbol.iterator)

let iterable = {}
iterable[Symbol.iterator] = function() {
  return fibonacciGenerator(10);
};

iterable.iterator; // undefined
Object.keys(iterable); // Empty array!
```

### Iterables and Generators
The most import thing to note about **generators** and **iterables** is that *generator* objects are **iterables**, **not** *generator functions*. In other words, you can't run a for/of loop on a generator function.

```javascript
fibonacciGenerator[Symbol.iterator]; // Undefined
fibonacciGenerator(10)[Symbol.iterator]; // Function

for (const x of fibonacciGenerator) {} // Error!
for (const x of fibonacciGenerator(10) {} // Ok
```

The second most import thing to notice is that `generator[Symbol.iterator]` is a function that returns the **generator** itself. This means that you can't loop over the same generator **twice**. Once a generator is done, subsequent for/of loops will exit immediately.

```javascript
const fibonacci = fibonacciGenerator(10);
fibonacci[Symbol.iterator]() === fibonacci; // true
for (const x of fibonacci) {
  // 1, 1, 2, 3, 5, ..., 55
}
for (const x of fibonacci) {
  // Doesn't run here since fibonacci has already been looped once!
}
```



