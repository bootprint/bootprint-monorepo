const OriginalPromise = Promise

/**
 * You cannot access the state of native Promises in NodeJS.
 * This promise is a wrapper implementation with a "state"-property.
 * It can either be "pending", "resolved" or "rejected".
 *
 * Only for use in test-cases
 */
class TestPromise extends Promise {
  constructor (fn) {
    super((resolve, reject) => fn(
      (value) => {
        this.state = 'resolved'
        resolve(value)
      },
      (err) => {
        this.state = 'rejected'
        reject(err)
      }
    ))
    this.state = 'pending'
  }

  static inject () {
    global.Promise = TestPromise
  }

  static restore () {
    global.Promise = OriginalPromise
  }
}

module.exports = TestPromise
