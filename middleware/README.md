# Middleware

The concept of **middleware** in JavaScript is *a sequence of functions where one function is responsible for calling the next function in the sequence*. Conventional ES5-style middleware has the following characteristics:

```javascript
const middlewareFn = function(req, res, next) {
 // A middleware function takes in the request and response,
 // transforms them, and invokes `next()` to trigger the next 
 // function in the middleware chain.
};
```

### Dependencies 
* [koa-compose](https://www.npmjs.com/package/koa-compose) - Compose the given middleware and returning a fully valid middleware comprised of all those which are passed. 