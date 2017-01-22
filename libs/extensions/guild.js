//
// Copyright (c) 2017 DrSmugleaf
//

class GuildExtension {
  get language() {
    if(!this._language) {
      const language = this.guild.settings.get("server-language")
      this._language = language
    }
    return this._language || "english"
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
