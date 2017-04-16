//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const CustomCommandAdmin = require("./admin")
const request = require("request-promise")
const responses = require("../../util/constants").responses.CUSTOM_COMMAND
const Song = require("../youtube/base/song")
const winston = require("winston")

module.exports = class CustomVoiceCommandCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "custom-voice-command",
      aliases: [
        "custom-voice-command", "customvoicecommand", "custom-voice-cmd", "customvoicecmd",
        "custom-command-voice", "customcommandvoice", "custom-cmd-voice", "customcmdvoice"
      ],
      group: "customcommand",
      memberName: "custom-voice-command",
      description: "Make a basic custom command to play in a voice channel.",
      examples: ["custom-voice-command"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "name",
          prompt: "What name do you want for this command?",
          type: "string"
        },
        {
          key: "video",
          prompt: "What youtube video do you want this command to play?",
          type: "string",
          validate: (video) => {
            return new Promise((resolve) => {
              request.get({
                url: "https://www.googleapis.com/youtube/v3/videos",
                qs: {
                  key: process.env.GOOGLE_KEY,
                  id: Song.id(video),
                  part: "snippet"
                },
                json: true
              }).then((video) => {
                video = video.items[0]
                if(!video) return resolve(false)
                if(video.snippet.liveBroadcastContent !== "none") return resolve(false)
                resolve(true)
              }).catch((e) => {
                winston.error(e)
                resolve(false)
              })
            })
          },
          parse: (video) => {
            return new Promise((resolve) => {
              request.get({
                url: "https://www.googleapis.com/youtube/v3/videos",
                qs: {
                  key: process.env.GOOGLE_KEY,
                  id: Song.id(video),
                  part: "snippet"
                },
                json: true
              }).then((video) => {
                video = video.items[0]
                video.url = `https://www.youtube.com/watch?v=${video.id}`
                resolve(video)
              }).catch((e) => {
                winston.error(e)
                resolve(null)
              })
            })
          }
        }
      ]
    })
  }

  async run(msg, args) {
    const name = args.name.toLowerCase()
    const video = args.video

    if(this.client.registry.commands.get(name)) {
      return msg.reply(responses.ALREADY_EXISTS[msg.language](name))
    }

    const command = {
      url: video
    }
    CustomCommandAdmin.registerCommand(msg.guild, name, command)

    const commandPrefix = msg.guild.commandPrefix
    const prefix = commandPrefix ? commandPrefix : commandPrefix === "" ?
      `<@${msg.client.user.id}>` : msg.client.options.commandPrefix
    return msg.reply(responses.REGISTERED[msg.language](prefix + name))
  }
}
