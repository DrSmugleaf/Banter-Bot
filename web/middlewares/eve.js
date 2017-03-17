//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = {
  eveAuth(req, res, next) {
    if(req.session.character) return next()
    res.redirect("/eve/login")
  }
}
