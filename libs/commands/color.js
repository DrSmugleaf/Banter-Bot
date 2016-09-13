"use strict"

function _parseHex(hex) {
  return parseInt(hex.replace("#", "0x"), 16).toString(16) === hex.replace("#", "").replace("0x", "").toLowerCase() ? parseInt(hex.replace("#", "0x"), 16) : undefined
}

class Color {
  constructor() {}
}

Color.prototype.change = function(discord, msg) {
  //let hex = msg.content.substr(msg.content.indexOf(" ") + 1)
  let hex = msg.content.replace("!color", "")
  console.log(hex)
  if(hex == "") {
    if(msg.server === undefined) {
      msg.channel.sendMessage("Usa el comando en un servidor")
      return
    }
    console.log(msg.server.rolesOfUser(msg))
    for(let role in msg.server.rolesOfUser(msg)) {
      console.log(role)
      console.log(role.name)
      if(role.name.includes("color-")) {
        discord.removeMemberFromRole(msg, role, function(e) {
          if(e) { throw e }
          if(msg.server.usersWithRole(role) === undefined) {
            discord.deleteRole(role, function(e) {
              if(e) { throw e }
            })
          }
        })
      }
    }
    return
  }

  let color = _parseHex(hex)

  if(color === undefined) {
    msg.channel.sendMessage("Código hex inválido")
  }

  let data = {
    color: color,
    name: "color-" + color,
  }
  discord.createRole(msg, data, function(e, role) {
    if(e) { throw e }
    discord.addMemberToRole(msg, role, function(e) {
      if(e) { throw e }
      console.log("done")
    })
  })
}

module.exports = Color
