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
  }
}
