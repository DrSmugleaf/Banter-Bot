//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

class MessageExtension {
  get language() {
    return "english"
  }

  static applyToClass(target) {
    for(const prop of [
      "language"
    ]) {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(this.prototype, prop))
    }
  }
}

module.exports = MessageExtension
