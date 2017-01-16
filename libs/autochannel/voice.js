//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const AutoChannel = require("./base")

module.exports = class VoiceAutoChannel extends AutoChannel {
  constructor(discord) {
    super(discord, "voice")

    this.discord = discord

    this.discord.on("presenceUpdate", (oldMember, newMember) => {
      super.onPresenceUpdate(newMember.guild)
    })

    this.discord.on("ready", () => {
      super.onReady()
    })

    this.discord.on("voiceStateUpdate", (oldMember, newMember) => {
      if(oldMember.voiceChannel === newMember.voiceChannel) return
      super.onVoiceStateUpdate(newMember.guild)
    })
  }
}
