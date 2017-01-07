//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"

class ArrayUtil {
  constructor() {}
}

ArrayUtil.prototype.clone = function(obj) {
  if(null == obj || typeof obj != "object") return obj
  var copy = obj.constructor()
  for(var attr in obj) {
    if(obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
  }
  return copy
}

ArrayUtil.prototype.contains = function(element) {
  return this.indexOf(element) > -1
}

module.exports = ArrayUtil
