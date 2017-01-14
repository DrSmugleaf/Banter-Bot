//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const constants = require("../../util/constants")
const commando = require("discord.js-commando")
const ObjectUtil = require("../../util/objectutil")
const objectutil = new ObjectUtil()
const winston = require("winston")

module.exports = class Color extends commando.Command {
  constructor(client) {
    super(client, {
      name: "color",
      aliases: ["color", "colour"],
      group: "misc",
      memberName: "color",
      description: "Change your color's name in the server",
      examples: ["color green"],
      args: [
        {
          key: "color",
          prompt: "What color do you want?",
          type: "string",
          default: "none"
        }
      ]
    })
  }

  async addColor(msg, hex) {
    if(msg.guild.roles.exists("name", "color-" + msg.author.id)) {
      this.editColor(msg, hex)
      return
    }

    msg.guild.createRole({
      name: "color-" + msg.author.id,
      color: hex,
      permissions: []
    })
      .then(role => {
        msg.member.addRole(role.id)
        msg.reply(constants.responses.COLOR.ADDED["english"](hex))
      })
      .catch(winston.error)
  }

  async editColor(msg, hex) {
    msg.guild.roles.filter(function(role) {
      return role.name == "color-" + msg.author.id
    }).first().edit({color: hex})
      .then(msg.reply(constants.responses.COLOR.ADDED["english"](hex)))
  }

  async removeColor(msg) {
    msg.guild.roles.filter(function(role) {
      return role.name == "color-" + msg.author.id
    }).forEach(function(role) {
      role.delete()
    })
    msg.reply(constants.responses.COLOR.REMOVED["english"])
  }

  async run(msg, args) {
    if(!msg.guild || !msg.guild.available) {
      msg.reply(constants.responses.NOT_A_SERVER["english"])
      return
    }

    const color = args.color
    if(color == "none") {
      this.removeColor(msg)
      return
    }

    const hex = color.toHex()
    if(!hex) {
      let word = color.replace(/ |-|'|\/|/g, "").toLowerCase()
      if(objectutil.hasKey(constants.colors, word)) {
        this.addColor(msg, constants.colors[word])
        return
      } else {
        msg.reply(constants.responses.COLOR.INVALID["english"])
        return
      }
    } else {
      this.addColor(msg, hex)
    }
  }
}
