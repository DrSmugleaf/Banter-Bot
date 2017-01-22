//
// Copyright (c) 2017 DrSmugleaf
//

class MemberExtension {
  get language() {
    if(!this._language) {
      const userSettings = this.guild.settings.get(this.id)
      this._language = userSettings.language
      return userSettings.language
    }
    return this._language
  }

  set language(language) {
    const userSettings = this.guild.settings.get(this.id, {})
    this._language = language
    userSettings.language = language
    this.guild.settings.set(this.id, userSettings)
  }

  static applyToClass(target) {
    for(const prop of [
      "language"
    ]) {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(this.prototype, prop))
    }
  }
}

module.exports = MemberExtension
