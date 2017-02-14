//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
require("dotenv").config({ path: __dirname + "/../.env" })
const constants = require("../libs/util/constants")
const client = require("../banterbot").client

before(function(done) {
  global.constants = constants
  global.client = client
  client.on("dbReady", () => {
    global.guild = client.guilds.get("260158980343463937")
    global.guild.createChannel("test", "text").then((channel) => {
      global.channel = channel
      done()
    })
  })
})

beforeEach(function(done) {
  setTimeout(done, 2000)
})

after(function() {
  return global.channel.delete()
})
