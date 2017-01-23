//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

class MessageExtension {
  get language() {
    return this.member && this.member.language ? this.member.language :
      this.guild && this.guild.language ? this.guild.language :
      this.author && this.author.language ? this.author.language :
      "english"
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
