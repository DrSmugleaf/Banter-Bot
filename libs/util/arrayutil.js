"use strict"

Array.prototype.clone = function() {
  return this.slice(0)
}

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
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
  }
  return copy
}

module.exports = ArrayUtil
