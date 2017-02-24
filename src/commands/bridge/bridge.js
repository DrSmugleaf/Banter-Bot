//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const Bridge = require("./base/bridge")
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const ObjectUtil = require("../../util/objectutil")
const responses = constants.responses.BRIDGE

module.exports = class BridgeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "bridge",
      aliases: ["bridge", "orboffusing"],
      group: "bridge",
      memberName: "bridge",
      description: "Bridge channels together, translating messages between them.",
      examples: ["bridge general:english games:none", "bridge games:fr offtopic:italian"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "channelsToBridge",
          label: "channels",
          prompt: "What channels do you want to link together?",
          type: "string",
          validate: (value, msg) => {
            const pairs = value.split(" ")

            return pairs.length > 1 && pairs.every(element => {
              const channelName = element.replace(/:\w*/g, "")
              const language = element.replace(/\w*:/g, "").toLowerCase()

              return msg.guild.channels.exists("name", channelName) &&
                (constants.mslanguages.hasOwnProperty(language) ||
                  ObjectUtil.hasValue(constants.mslanguages, language)
              )
            })
          },
          parse: (pairs) => {
            pairs = pairs.split(" ")
            const parsedPairs = new Array()

            pairs.forEach((pair) => {
              const channelName = pair.split(":")[0]
              var language = pair.split(":")[1].toLowerCase()

              if(!constants.mslanguages.hasOwnProperty(language)) {
                language = _.invert(constants.mslanguages)[language]
              }

              parsedPairs.push(`${channelName}:${language}`)
            })

            return parsedPairs
          }
        }
      ]
    })

    this.client.once("dbReady", () => {
      this.bridge = new Bridge(this.client)
      this.ready = true
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("ADMINISTRATOR")
  }

  async run(msg, args) {
    if(!this.ready) return msg.reply(responses.NOT_READY[msg.language])
    const bridged = msg.guild.settings.get("bridged", {})
    const channelsToBridge = args.channelsToBridge

    channelsToBridge.forEach((channel) => {
      const channelName = channel.replace(/:\w*/g, "")
      const channelID = msg.guild.channels.find("name", channelName).id
      const channelLanguage = channel.replace(/\w*:/g, "")
      const otherChannels = []

      channelsToBridge.forEach((subChannel) => {
        if(channel == subChannel) return
        const subchannelName = subChannel.replace(/:\w*/g, "")
        const subchannelID = msg.guild.channels.find("name", subchannelName).id

        otherChannels.push(subchannelID)
      })

      bridged[channelID] = {
        name: channelName,
        id: channelID,
        language: channelLanguage,
        connectedchannels: otherChannels
      }
    })

    msg.guild.settings.set("bridged", bridged)
    return msg.reply(responses.BRIDGED[msg.language](channelsToBridge.join(", ")))
  }
}
