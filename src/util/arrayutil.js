//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"

module.exports = {
  clone(object) {
    if(object == null || typeof object != "object") return object
    var copy = object.constructor()
    for(const attribute in object) {
      if(object.hasOwnProperty(attribute)) copy[attribute] = object[attribute]
    }
    return copy
  },

  equals(array, array2) {
    if(!array || !array2) return false

    if(array.length !== array2.length) return false

    for(var i = 0; i < array.length; i++) {
      if(array[i] instanceof Array && array2[i] instanceof Array) {
        if(!array[i].equals(array2[i])) return false
      } else if(array[i] !== array2[i]) return false
    }

    return true
  }
}
