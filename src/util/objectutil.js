//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"

module.exports = {
  hasKey(object, key) {
    return object.hasOwnProperty(key)
  },

  hasValue(object, value) {
    for(const property in object) {
      if(object.hasOwnProperty(property) && object[property] === value) return property
    }
  },

  hasKeyAndValue(object, key, value) {
    return object.hasOwnProperty(key) && object[key] === value
  }
}
