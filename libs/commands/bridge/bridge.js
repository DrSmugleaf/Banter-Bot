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



            // let channels = value.replace(/:\w*/g).split(" ")
            // let languages = value.replace(/\w*:/g).split(" ")
            // return channels.every(function(element) {
            //   return msg.guild.channels.exists("name", element)
            // })



            // console.log(channels.every(function(element) {
            //   return msg.guild.channels.exists("name", element)
            // }))
            // return channels.every(function(element) {
            //   return msg.guild.channels.exists("name", element)
            // })
            // &&
            // languages.every(function(element) {
            //   return mstranslator.getLanguageNames().includes(element)
            //   ||
            //   mstranslator.getLanguagesForTranslate().includes(element)
            // })
          }
        }
      ]
    })

    // this.bridged = {}
    // client.guilds.forEach(guild => {
    //   this.bridged[guild.id] = this.getBridged(guild)
    // })
  }

  async getBridged(guild) {
    return guild.settings.get("bridged", {})
  }

  async setBridged(guild, bridged) {
    guild.settings.set("bridged", bridged)
    // this.bridged[guild.id] = bridged
  }

  hasPermission(msg) {
    return msg.member.hasPermission("ADMINISTRATOR")
  }

  // async run(msg, args) {
  //   const channelsToBridge = args.channelsToBridge.split(" ")
  //   let settings = msg.guild.settings.get("bridge", [])
  //   let channelIdsToBridge = []
  //   for(let i = 0; i < channelsToBridge.length; i++) {
  //     let channel = msg.guild.channels.find("name", channelsToBridge[i]).id
  //     channelIdsToBridge.push(channel)
  //   }
  //   settings.push(channelIdsToBridge)
  //   await msg.guild.settings.set("bridge", settings)
  //
  //   return msg.reply(`Bridged channels \`${channelsToBridge.join(", ")}\``)
  // }

  // async run(msg, args) {
  //   let channels = args.channelsToBridge.split(" ")
  //   channels.forEach(function(element) {
  //     let channelname = element.replace(/:\w*/g, "")
  //     let channelid = msg.guild.channels.find("name", channelname).id
  //     channels.replace(element, channelid + element.replace(channelname, ""))
  //   })
  //
  //   let bridged = {}
  //   for(let i = 0; i < channels.length; i++) {
  //     let otherchannels = channels.slice(channels[i])
  //     let language = channels[i].replace(/\w*:/g)
  //     channelsobject[channelid] = {
  //       name: channelname,
  //       id: channelid,
  //       language: language
  //     }
  //     channelsobject[channelid].language = language
  //
  //     for(let j = 0; j < otherchannels.length; i++) {
  //       let otherchannel
  //       channelsobject[channelid][otherchannels[i]]
  //     }
  //   }
  // }

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
