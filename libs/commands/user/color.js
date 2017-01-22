//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const constants = require("../../util/constants")
const commando = require("discord.js-commando")
const parse = require("parse-color")
const winston = require("winston")

module.exports = class Color extends commando.Command {
  constructor(client) {
    super(client, {
      name: "color",
      aliases: ["color", "colour"],
      group: "user",
      memberName: "color",
      description: "Change your name color in this server.",
      examples: ["color red", "color #FF0000"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "color",
          prompt: "What color do you want?",
          type: "string",
          default: "",
          validate: (color) => {
            return Boolean(constants.colors.hasOwnProperty(color) ||
              parse(color).hex || color === "")
          }
        }
      ]
    })

    this.roleName = (userid) => `color-${userid}`
  }

  parseColor(color) {
    if(constants.colors.hasOwnProperty(color)) return constants.colors[color]
    return parse(color).hex
  }

  addColor(msg, color) {
    const existingRole = msg.member.roles.find("name", this.roleName(msg.member.id))

    if(existingRole) {
      existingRole.edit({ color: color }).then(() => {
        return msg.reply(constants.responses.COLOR.ADDED["english"](msg.argString))
      }).catch(winston.error)
    }

    msg.guild.createRole({
      name: this.roleName(msg.member.id),
      color: color,
      permissions: []
    }).then(role => {
      msg.member.addRole(role.id)
      return msg.reply(constants.responses.COLOR.ADDED["english"](msg.argString))
    }).catch(winston.error)
  }

  removeColor(msg) {
    const role = msg.member.roles.find("name", this.roleName(msg.member.id))

    if(role) {
      role.delete().then(() => {
        return msg.reply(constants.responses.COLOR.REMOVED["english"])
      })
    } else {
      return msg.reply(constants.responses.COLOR.MISSING["english"])
    }
  }

  async run(msg, args) {
    const color = args.color ? this.parseColor(args.color) : null

    if(!color) {
      return this.removeColor(msg, color)
    } else {
      return this.addColor(msg, color)
    }
  }
}
