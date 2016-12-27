//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const ObjectUtil = require("../../util/objectutil")
const objectutil = new ObjectUtil()


module.exports = class Bridge extends commando.Command {
  constructor(client) {
    super(client, {
      name: "bridge",
      aliases: ["bridge", "orboffusing"],
      group: "bridge",
      memberName: "bridge",
      description: "Bridge channels together, translating messages between them",
      examples: ["bridge general:english games:none", "bridge games:fr offtopic:italian"],
      guildOnly: true,
      args: [
        {
          key: "channelsToBridge",
          label: "channels",
          prompt: "What channels do you want to link together?",
          type: "string",
          validate: (value, msg) => {
            let values = value.split(" ")
            return values.length > 1 && values.every(element => {
              let channelname = element.replace(/:\w*/g, "")
              let language = element.replace(/\w*:/g, "")
              return msg.guild.channels.exists("name", channelname)
              && (constants.languages.hasOwnProperty(language)
                || objectutil.hasValue(constants.languages, language))
            })
          }
        }
      ]
    })
  }

  async getBridged(guild) {
    return guild.settings.get("bridged", {})
  }

  async setBridged(guild, bridged) {
    guild.settings.set("bridged", bridged)
  }

  hasPermission(msg) {
    return msg.member.hasPermission("ADMINISTRATOR")
  }

  async run(msg, args) {
    var bridged = this.getBridged(msg.guild)
    var channelsToBridge = args.channelsToBridge.split(" ")

    channelsToBridge.forEach(function(channel) {
      var channelname = channel.replace(/:\w*/g, "")
      var channelid = msg.guild.channels.find("name", channelname).id
      var channellanguage = channel.replace(/\w*:/g, "")
      var otherchannels = []
      channelsToBridge.forEach(function(subchannel) {
        if(channel == subchannel) return
        var subchannelname = subchannel.replace(/:\w*/g, "")
        var subchannelid = msg.guild.channels.find("name", subchannelname).id
        otherchannels.push(subchannelid)
      })

      bridged[channelid] = {
        name: channelname,
        id: channelid,
        language: channellanguage,
        connectedchannels: otherchannels
      }
    })

    this.setBridged(msg.guild, bridged)
    return msg.reply(`Bridged channels ${channelsToBridge.join(", ")}`)
  }
}
