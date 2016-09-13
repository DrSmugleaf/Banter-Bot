"use strict"

Array.prototype.contains = function(element) {
  return this.indexOf(element) > -1
}

class ArrayUtil {
  constructor() {}
}

ArrayUtil.prototype.clone = function(obj) {
  if(null == obj || "object" != typeof obj) return obj
  var copy = obj.constructor()
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
  }
  return copy
}

module.exports = ArrayUtil
