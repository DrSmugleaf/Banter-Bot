//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const constants = require("../util/constants")
const stripIndents = require("common-tags").stripIndents

module.exports = class Version {
  constructor(client) {
    this.client = client
    this.checkVersion()
  }

  checkVersion() {
    const version = this.client.settings.get("version")

    if(version < Object.keys(constants.versions).length + 1) {
      this.client.guilds.forEach((guild) => {
        if(process.env.NODE_ENV === "dev" && guild.id !== "260158980343463937") return
        const infoChannel = guild.channels.get(guild.settings.get("info-channel", guild.defaultChannel.id))
        infoChannel.sendMessage(stripIndents`@everyone
          ${constants.versions[version + 1][guild.language]}
        `)
      })
      if(!process.env.NODE_ENV === "dev") this.client.settings.set("version", version + 1)
    }
  }
}
