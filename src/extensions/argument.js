//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const { oneLine, stripIndents } = require("common-tags")
const responses = require("../util/constants").responses.COMMANDO.ARGUMENT

class CommandArgumentExtension {
  async promptUser(msg, value, client, type) {
    if(this.infinite) return this.obtainInfinite(msg, value)

    const wait = this.wait > 0 && this.wait !== Infinity ? this.wait * 1000 : undefined
    let valid = value ? await this.validate(value, msg) : false
    let attempts = 0

    while(!valid || typeof valid === "string") {
      attempts++
      if(attempts > this.command.argsPromptLimit) return msg.constructor.SILENT_CANCEL
      msg.promptCount++

      await msg.reply(stripIndents`
        ${!value ? this.prompt : valid ? valid : responses.INVALID_LABEL[msg.language](this.label)}
        ${oneLine`
          ${responses.RESPOND_WITH_CANCEL[msg.language]}
          ${wait ? responses.WAIT[msg.language](this.wait) : ""}
        `}
      `)

      const response = await msg.channel.awaitMessages(msg2 => msg2.author.id === msg.author.id, {
        maxMatches: 1,
        times: wait
      })
      if(response && response.size === 1) value = response.first().content; else return null
      if(value.toLowerCase() === "cancel") return null
      valid = type ? await client.registry.types.get(type).validate(value, msg) : await this.validate(value.msg)
    }

    return type ? client.registry.types.get(type).parse(value, msg) : this.parse(value, msg)
  }

  static applyToClass(target) {
    for(const prop of [
      "promptUser"
    ]) {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(this.prototype, prop))
    }
  }
}

module.exports = CommandArgumentExtension
