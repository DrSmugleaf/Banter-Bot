//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const CommandBase = require("./commandbase")
const constants = require("../util/constants")
const ObjectUtil = require("../util/objectutil")
const objectutil = new ObjectUtil()
const winston = require("winston")

function _addColor(msg, hex) {
  if(msg.guild.roles.exists("name", "color-" + msg.author.id)) {
    _editColor(msg, hex)
    return
  }

  msg.guild.createRole({
    name: "color-" + msg.author.id,
    color: hex,
    permissions: []
  })
    .then(role => {
      msg.member.addRole(role.id)
      msg.channel.sendMessage(constants.responses.COLOR.ADDED[this.language](hex))
    })
    .catch(winston.error)
}

function _editColor(msg, hex) {
  msg.guild.roles.filter(function(role) {
    return role.name == "color-" + msg.author.id
  }).first().edit({color: hex})
    .then(msg.channel.sendMessage(constants.responses.COLOR.ADDED[this.language](hex)))
}

function _removeColor(msg) {
  msg.guild.roles.filter(function(role) {
    return role.name == "color-" + msg.author.id
  }).forEach(function(role) {
    role.delete()
  })
  msg.channel.sendMessage(constants.responses.COLOR.REMOVED[this.language])
}

class Color extends CommandBase {
  constructor() {
    super()
  }
}

Color.prototype.change = function(msg) {
  if(!msg.guild || !msg.guild.available) {
    msg.channel.sendMessage(constants.responses.NOT_A_SERVER(this.language))
    return
  }

  let command = this.commandtext.replace("!color change")
  winston.info(command)
  winston.info(typeof command === "undefined")
  if(command == "undefined") {
    _removeColor(msg)
    return
  }

  var hex = command.toHex()
  if(!hex) {
    let word = command.replace(/ |-|'|\/|/g, "").toLowerCase()
    if(objectutil.hasKey(constants.colors, word)) {
      _addColor(msg, constants.colors[word])
      return
    }
    msg.channel.sendMessage(constants.responses.COLOR.INVALID[this.language])
    return
  } else {
    _addColor(msg, hex)
  }
}

module.exports = Color
