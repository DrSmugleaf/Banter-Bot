//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

class GuildExtension {
  get language() {
    if(!this._language) {
      const language = this.settings.get("server-language")
      this._language = language
    }
    return "english"
  }

  set language(language) {
    this._language = language
    this.settings.set("server-language", language)
  }

  static applyToClass(target) {
    for(const prop of [
      "language"
    ]) {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(this.prototype, prop))
    }
  }
}

module.exports = GuildExtension
