/**
 * Create a promise that resolves to the return value of `fn`.
 * `fn` is only called, if the `.then`-method of the promise is called.
 * And it is called only once.
 * @param fn
 */
module.exports = function(fn) {
  let _resolve, _reject, innerPromise
  const promise = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  const oldThen = promise.then
  promise.then = function() {
    if (!innerPromise) {
      innerPromise = Promise.resolve().then(fn)
    }
    innerPromise.then(_resolve, _reject)
    return oldThen.apply(promise, arguments)
  }
  return promise
}
