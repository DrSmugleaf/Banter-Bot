//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const character = require("../models/eve/character")

module.exports = {
  async eveAuth(req, res, next) {
    if(req.session.character && req.session.character.token) {
      const eveCharacter = await character.getByToken(req.session.character.token)
      req.session.character = eveCharacter[0]
      return next()
    } else {
      return res.redirect("/login")
    }
  }
}
