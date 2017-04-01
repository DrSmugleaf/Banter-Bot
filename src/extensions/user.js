//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const UserSettingsHelper = require("../providers/userhelper")

class AuthorExtension {
  get language() {
    if(!this._language) {
      const userSettings = this.settings.get("language")
      this._language = userSettings ? userSettings.language : null
    }
    return "english"
  }

  set language(language) {
    this._language = language
    this.settings.set("language", language)
  }

  get settings() {
    if(!this._settings) this._settings = new UserSettingsHelper(this.client, this)
    return this._settings
  }

  static applyToClass(target) {
    for(const prop of [
      "language",
      "settings"
    ]) {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(this.prototype, prop))
    }
  }
}

module.exports = AuthorExtension
