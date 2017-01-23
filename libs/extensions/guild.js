//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

class GuildExtension {
  get language() {
    if(!this._language) {
      const language = this.guild.settings.get("server-language")
      this._language = language || "english"
    }
    return this._language
  }

  set language(language) {
    this._language = language
    this.guild.settings.set("server-language", language)
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
