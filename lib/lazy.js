/*
 This file is take from nailguns q-lazy package at
 https://raw.githubusercontent.com/nailgun/q-lazy/master/index.js

 The MIT License (MIT)

 Copyright (c) 2013-2014 Dmitry Bashkatov

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

'use strict'

var Q = require('q')

module.exports = function (fn) {
  var deferred = Q.defer()
  var promise = deferred.promise
  var initiated = false

  var then = promise.then
  promise.then = function () {
    if (!initiated) {
      Q(fn()).then(deferred.resolve, deferred.reject, deferred.notify)
      initiated = true
    }

    return then.apply(promise, arguments)
  }

  return promise
}
