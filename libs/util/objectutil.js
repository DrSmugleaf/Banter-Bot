//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"

class ObjectUtil {
  constructor() {}
}

ObjectUtil.prototype.hasKey = function(obj, key) {
  return obj.hasOwnProperty(key)
}

ObjectUtil.prototype.hasValue = function(obj, value) {
  for(let v in obj) {
    if(value === v) return true
  }
}

ObjectUtil.prototype.hasKeyAndValue = function(obj, key, value) {
  return obj.hasOwnProperty(key) && obj[key] === value
}

module.exports = ObjectUtil
