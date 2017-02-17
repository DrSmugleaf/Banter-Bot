//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

class UserSettingsHelper {
  constructor(client, user) {
    Object.defineProperty(this, "client", { value: client })

    this.user = user
  }

  get(key, defVal) {
    if(!this.client.provider) throw new Error("No settings provider is available.")
    return this.client.provider.get(this.user, key, defVal)
  }

  set(key, val) {
    if(!this.client.provider) throw new Error("No settings provider is available.")
    return this.client.provider.set(this.user, key, val)
  }

  remove(key) {
    if(!this.client.provider) throw new Error("No settings provider is available.")
    return this.client.provider.remove(this.user, key)
  }

  clear() {
    if(!this.client.provider) throw new Error("No settings provider is available.")
    return this.client.provider.clear(this.user)
  }
}

module.exports = UserSettingsHelper
