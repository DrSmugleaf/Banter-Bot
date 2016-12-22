//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"

class ObjectUtil {
  constructor() {}
}

ObjectUtil.prototype.hasKey = function(object, key) {
  return object.hasOwnProperty(key)
}

ObjectUtil.prototype.hasValue = function(object, value) {
  for(var property in object) {
    if(object.hasOwnProperty(property) && object[property] === value) return property
  }
}

ObjectUtil.prototype.hasKeyAndValue = function(obj, key, value) {
  return obj.hasOwnProperty(key) && obj[key] === value
}

module.exports = ObjectUtil
