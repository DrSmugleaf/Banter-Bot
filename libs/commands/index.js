//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const constants = require("../util/constants")
// const Color = require("./color")
// const Coult = require("./coult")
// const Erika = require("./erika")
// const Help = require("./help")
// const Josde = require("./josde")
// const Magic8Ball = require("./magic8ball")
// const Quote = require("./quote")
// const Seifer = require("./seifer")
// const Youtube = require("./youtube")
//
// exports.color = new Color()
// exports.coult = new Coult()
// exports.erika = new Erika()
// exports.help = new Help()
// exports.josde = new Josde()
// exports.magic8ball = new Magic8Ball()
// exports.quote = new Quote()
// exports.seifer = new Seifer()
// exports.youtube = new Youtube()

let commands = {}
for(let command in constants.commands) {
  for(let commandname in constants.commands[command]) {
    commands[command] = require("./" + command)
    exports[constants.commands[command][commandname]] = new commands[command]()
  }
  // commands[command] = require("./" + command)
  // exports[command] = new commands[command]()
}
