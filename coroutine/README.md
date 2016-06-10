# Asynchronous Coroutines

A **coroutine** is a function that can suspend its execution and defer to another function. For instance, generator functions are coroutines, and the `yield` statement is how a generator function defers control to another function.
 
By `yielding asynchronous` operations, you can write asynchronous operations without callbacks. When your generator function yields an asynchronous operation, the calling function needs to handle the asynchronous operation and resume the generator when the asynchronous operation completes.

### Dependencies 
* [Co](https://www.npmjs.com/package/co) - Generator based control flow goodness for writing non-blocking code.
* [SuperAgent](https://www.npmjs.com/package/superagent) - A small progressive **client-side** HTTP request library.
* [Thunkify](https://www.npmjs.com/package/thunkify) - Turn callbacks, arrays, generators, generator functions, and promises into a thunk.


### Promises and Thunks
A **thunk** is an asynchronous function that takes a single parameter, a callback.

```javascript
const async = function(callback) {
 setTimeout(() => callback(new Error('Oops!')), 10);
};  
```

```javascript
superagent.get('http://google.com', function(error,res) {
// Handle error, use res
});
```
The `async()` function above is an example of a thunk, and the `superagent.get()` function is *not* a thunk, because it takes **2** parameters, a url and a callback.







