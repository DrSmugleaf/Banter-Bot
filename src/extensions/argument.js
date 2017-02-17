//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const constants = require("../util/constants").responses.COMMANDO.ARGUMENT
const { oneLine, stripIndents } = require("common-tags")

class CommandArgumentExtension {
  async obtainSimple(msg) {
    let value
    if(this.infinite) return this.obtainInfinite(msg, value)

    const wait = this.wait > 0 && this.wait !== Infinity ? this.wait * 1000 : undefined
    let valid = false
    let attempts = 0

    while(!valid || typeof valid === "string") {
      attempts++
      if(attempts > this.command.argsPromptLimit) return msg.constructor.SILENT_CANCEL
      msg.promptCount++

      await msg.reply(stripIndents`
        ${!value ? this.prompt : valid ? valid : constants.INVALID_LABEL[msg.language](this.label)}
        ${oneLine`
          ${constants.RESPOND_WITH_CANCEL[msg.language]}
          ${wait ? constants.WAIT[msg.language](this.wait) : ""}
        `}
      `)

      const responses = await msg.channel.awaitMessages(msg2 => msg2.author.id === msg.author.id, {
        maxMatches: 1,
        times: wait
      })
      if(responses && responses.size === 1) value = responses.first().content; else return null
      if(value.toLowerCase() === "cancel") return null
      valid = await this.validate(value, msg)
    }

    return this.parse(value, msg)
  }

  static applyToClass(target) {
    for(const prop of [
      "obtainSimple"
    ]) {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(this.prototype, prop))
    }
  }
}

module.exports = CommandArgumentExtension
