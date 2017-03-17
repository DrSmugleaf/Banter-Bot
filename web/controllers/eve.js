//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const character = require("../models/eve/character")
const contract = require("../models/eve/contract")
const eveAuth = require("../middlewares/eve").eveAuth
const express = require("express")
const moment = require("moment-timezone")
const nFormatter = require("../helpers/eve").nFormatter
const router = express.Router()
const request = require("request-promise")
const session = require("express-session")
const url = require("url")
const winston = require("winston")

router.use(session({
  secret: require("crypto").randomBytes(64).toString("hex"),
  resave: false,
  saveUninitialized: true,
  maxAge: 1200000
}))

router.get("/login", function(req, res) {
  const state = require("crypto").randomBytes(64).toString("hex")
  req.session.state = state
  res.redirect(`https://login.eveonline.com/oauth/authorize/?response_type=code&redirect_uri=${process.env.EVE_CALLBACK}&client_id=${process.env.EVE_ID}&state=${state}`)
})

router.get("/eve", function(req, res) {
  res.render("pages/eve/index", {
    character: req.session.character,
    title: "Home - Mango Deliveries",
    active: "Home"
  })
})

router.get("/contracts", eveAuth, function(req, res) {
  contract.getAll().then((contracts) => {
    res.render("pages/eve/contracts", {
    character: req.session.character,
    contracts: contracts,
    title: "Contracts - Mango Deliveries",
    active: "Contracts"
    })
  })
})

router.get("/auth", function(req, res) {
  if(req.query.state !== req.session.state) return res.sendStatus(403)
  var eveCharacter = {}
  request.post({
    headers: {
      "Authorization": `Basic ${new Buffer(`${process.env.EVE_ID}:${process.env.EVE_SECRET}`).toString("base64")}`
    },
    url: "https://login.eveonline.com/oauth/token",
    form: {
      "grant_type": "authorization_code",
      "code": req.query.code
    }
  }).then((body) => {
    body = JSON.parse(body)
    eveCharacter.token = body.access_token
    
    return request.get({
      headers: {
        "Authorization": `Bearer ${eveCharacter.token}`
      },
      url: "https://login.eveonline.com/oauth/verify"
    })
  }).then((body) => {
    body = JSON.parse(body)
    eveCharacter.id = body.CharacterID
    
    return Promise.all([
      request.get(`https://esi.tech.ccp.is/latest/characters/${body.CharacterID}/`),
      request.get(`https://esi.tech.ccp.is/latest/characters/${body.CharacterID}/portrait/`)
    ])
  }).then((bodies) => {
    _.forEach(bodies, (body, index) => {
      bodies[index] = JSON.parse(body)
    })
    eveCharacter.character_name = bodies[0].name
    eveCharacter.character_portrait = bodies[1].px64x64
    eveCharacter.character_birthday = moment(bodies[0].birthday).format("YYYY-MM-DD HH:MM:SS")
    eveCharacter.alliance_id = bodies[0].alliance_id
    eveCharacter.corporation_id = bodies[0].corporation_id
    
    return Promise.all([
      request.get(`https://esi.tech.ccp.is/latest/alliances/${eveCharacter.alliance_id}/`),
      request.get(`https://esi.tech.ccp.is/latest/alliances/${eveCharacter.alliance_id}/icons/`),
      request.get(`https://esi.tech.ccp.is/latest/corporations/${eveCharacter.corporation_id}/`),
      request.get(`https://esi.tech.ccp.is/latest/corporations/${eveCharacter.corporation_id}/icons/`)
    ])
  }).then((bodies) => {
    _.forEach(bodies, (body, index) => {
      bodies[index] = JSON.parse(body)
    })
    eveCharacter.alliance_name = bodies[0].alliance_name
    eveCharacter.alliance_portrait = bodies[1].px64x64
    eveCharacter.corporation_name = bodies[2].corporation_name
    eveCharacter.corporation_portrait = bodies[3].px64x64
    
    character.set(eveCharacter)
    req.session.character = eveCharacter
    res.redirect("/eve/eve")
  }).catch((e) => {
    winston.error(`Error while retrieving character: ${e}`)
    res.render("pages/404")
  })
})

router.get("/query", function(req, res) {
  var link = url.parse(req.query.link)
  const multiplier = req.query.multiplier || 1
  
  if(link && ["evepraisal.com", "skyblade.de"].includes(link.hostname)) {
    request.get({
      url: `${link.href}.json`
    }).then((body) => {
      body = JSON.parse(body)
      
      res.json({
        result: (body.totals.sell * multiplier).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        resultShort: nFormatter(body.totals.sell, 2, multiplier)
      })
    }).catch((e) => {
      winston.error(e)
    })
  }
})

router.post("/submit", function(req, res) {
  const link = req.body.link
  const multiplier = req.body.multiplier || 1
  
  request.get({
    url: `${link}.json`
  }).then((body) => {
    body = JSON.parse(body)
    contract.set({
      link: `${link}.json`,
      value: body.totals.sell,
      volume: body.totals.volume,
      multiplier: multiplier,
      submitter_id: req.session.character.id,
      submitter_name: req.session.character.character_name,
      status: "pending"
    })
  }).catch((e) => {
    winston.error(e)
    res.sendStatus(403)
  })
})

module.exports = router
