//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const winston = require("winston")

module.exports = class Avatar extends commando.Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      aliases: ["avatar", "image"],
      group: "util",
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
    return msg.author.id === this.client.options.owner
  }

  async run(msg, args) {
    const url = args.url

    msg.client.user.setAvatar(url).then(() => {
      return msg.reply(constants.responses.AVATAR.SET["english"](url))
    }).catch(e => {
      winston.error(e)
      return msg.reply(constants.responses.AVATAR.INVALID["english"](url))
    })
  }
}
