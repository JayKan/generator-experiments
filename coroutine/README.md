# Asynchronous Coroutines

A **coroutine** is a function that can suspend its execution and defer to another function. For instance, generator functions are coroutines, and the `yield` statement is how a generator function defers control to another function.
 
By `yielding asynchronous` operations, you can write asynchronous operations without callbacks. When your generator function yields an asynchronous operation, the calling function needs to handle the asynchronous operation and resume the generator when the asynchronous operation completes.




