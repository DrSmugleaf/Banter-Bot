//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const character = require("../models/eve/character")

module.exports = {
  async eveAuth(req, res, next) {
    if(req.session.eveToken) {
      const eveCharacter = await character.getByToken(req.session.eveToken)
      req.session.character = eveCharacter[0]
      return next()
    } else {
      return res.redirect("/eve/login")
    }
  }
}
