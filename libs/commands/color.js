//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
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
      msg.channel.sendMessage(`Añadido color ${hex}`)
    })
    .catch(winston.error)
}

function _editColor(msg, hex) {
  msg.guild.roles.filter(function(role) {
    return role.name == "color-" + msg.author.id
  }).first().edit({color: hex})
    .then(msg.channel.sendMessage(`Añadido color ${hex}`))
}

function _removeColor(msg) {
  msg.guild.roles.filter(function(role) {
    return role.name == "color-" + msg.author.id
  }).forEach(function(role) {
    role.delete()
  })
  msg.channel.sendMessage("Quitado color de nombre")
}

class Color {
  constructor() {
    this.colors = constants.Colors
  }
}

Color.prototype.change = function(msg) {
  if(!msg.guild || !msg.guild.available) {
    msg.channel.sendMessage("Usa el comando en un servidor")
    return
  }

  let command = msg.content.replace("!color", "")
  if(!command) {
    _removeColor(msg)
    return
  }

  var hex = command.toHex()
  if(!hex) {
    let word = command.replace(/ |-|'|\/|/g, "").toLowerCase()
    if(objectutil.hasKey(this.colors, word)) {
      _addColor(msg, this.colors[word])
      return
    }
    msg.channel.sendMessage("Color no existe o código inválido, formato: Nombre(Inglés) / #RRGGBB / (R,G,B)")
    return
  } else {
    _addColor(msg, hex)
  }
}

module.exports = Color
