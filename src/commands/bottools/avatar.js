//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const responses = require("../../util/constants").responses.AVATAR
const winston = require("winston")

module.exports = class Avatar extends commando.Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      aliases: ["avatar", "image"],
      group: "bottools",
      memberName: "avatar",
      description: "Change the bot's image.",
      examples: ["avatar http://i.imgur.com/DJcsFvt.png"],
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "url",
          prompt: "The url of the image to apply",
          type: "string",
          default: "http://i.imgur.com/DJcsFvt.png"
        }
      ]
    })
  }

  hasPermission(msg) {
    return this.client.isOwner(msg.author.id)
  }

  async run(msg, args) {
    const url = args.url

    msg.client.user.setAvatar(url).then(() => {
      return msg.reply(responses.SET[msg.language](url))
    }).catch(e => {
      winston.error(e)
      return msg.reply(responses.INVALID[msg.language](url))
    })
  }
}
