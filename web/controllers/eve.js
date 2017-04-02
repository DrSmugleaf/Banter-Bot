//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const character = require("../models/eve/character")
const contract = require("../models/eve/contract")
const eveAuth = require("../middlewares/eve").eveAuth
const eveHelper = require("../helpers/eve")
const express = require("express")
const invMarketGroups = require("../models/eve/invmarketgroups")
const invTypes = require("../models/eve/invtypes")
const moment = require("moment-timezone")
const router = express.Router()
const request = require("request-promise")
const session = require("express-session")
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

router.get("/auth", function(req, res) {
  const sessionState = req.session.state
  delete req.session.state
  if(req.query.state !== sessionState) return res.sendStatus(403)
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
    eveCharacter.character_portrait = bodies[1].px64x64.replace(/^http:\/\//i, "https://")
    eveCharacter.character_birthday = moment(bodies[0].birthday).format("YYYY-MM-DD HH:mm:ss")
    eveCharacter.alliance_id = bodies[0].alliance_id
    eveCharacter.corporation_id = bodies[0].corporation_id
    
    return Promise.all([
      request.get(`https://esi.tech.ccp.is/latest/alliances/${eveCharacter.alliance_id}/`),
      request.get(`https://esi.tech.ccp.is/latest/alliances/${eveCharacter.alliance_id}/icons/`),
      request.get(`https://esi.tech.ccp.is/latest/corporations/${eveCharacter.corporation_id}/`),
      request.get(`https://esi.tech.ccp.is/latest/corporations/${eveCharacter.corporation_id}/icons/`)
    ])
  }).then(async (bodies) => {
    _.forEach(bodies, (body, index) => {
      bodies[index] = JSON.parse(body)
    })
    eveCharacter.alliance_name = bodies[0].alliance_name
    eveCharacter.alliance_portrait = bodies[1].px64x64.replace(/^http:\/\//i, "https://")
    eveCharacter.corporation_name = bodies[2].corporation_name
    eveCharacter.corporation_portrait = bodies[3].px64x64.replace(/^http:\/\//i, "https://")
    
    character.set(eveCharacter)
    eveCharacter = await character.get(eveCharacter.id)
    req.session.character = eveCharacter[0]
    res.redirect("/eve/eve")
  }).catch((e) => {
    winston.error(`Error while retrieving character: ${e}`)
    res.render("pages/404")
  })
})

router.get("/eve", function(req, res) {
  res.render("pages/eve/index", {
    character: req.session.character || {},
    title: "Home - Mango Deliveries",
    active: "Home"
  })
})

router.get("/query", async function(req, res) {
  if(!req.session.character) return res.sendStatus(403)
  const validate = await eveHelper.validateAppraisal(req.query)
  if(validate.invalid) return res.status(400).json(validate)
  const appraisal = validate
  const price = appraisal.totals.sell
  const multiplier = req.query.multiplier || 1
  return res.status(200).json({
    jita: (price * multiplier).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    jitaShort: eveHelper.nShortener(price * multiplier, 2),
    quote: (price * 1.13 * multiplier).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    quoteShort: eveHelper.nShortener(price * 1.13 * multiplier, 2)
  })
})

router.post("/submit", async function(req, res) {
  if(!req.session.character) return res.sendStatus(403)
  const validate = await eveHelper.validateAppraisal(req.body)
  if(validate.invalid) return res.status(400).json(validate)
  const appraisal = validate
  const link = req.body.link
  const destination = req.body.destination
  const price = appraisal.totals.sell
  const multiplier = req.body.multiplier || 1
  const volume = appraisal.totals.volume
  
  contract.set({
    link: link,
    destination: destination,
    value: price * multiplier,
    value_formatted: (price * multiplier).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    value_short: eveHelper.nShortener(price * multiplier),
    quote: price * 1.13 * multiplier,
    quote_formatted: Math.round(price * 1.13 * multiplier).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    quote_short: eveHelper.nShortener(price * 1.13 * multiplier),
    volume: volume * multiplier,
    volume_formatted: (volume * multiplier).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    value_volume_ratio: Math.round(price / volume),
    value_volume_ratio_formatted: Math.round(price / volume).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    multiplier: multiplier,
    submitter_id: req.session.character.id,
    submitter_name: req.session.character.character_name,
    submitted: moment().unix(),
    submitted_formatted: moment().format("MMMM Do YYYY, HH:mm:ss"),
    status: "pending"
  })
})

router.get("/contracts", eveAuth, function(req, res) {
  var characterID
  var freighter = req.session.character.freighter || req.session.character.director
  if(!freighter) {
    characterID = req.session.character.id
  }
  
  Promise.all([
    contract.getAllPending(characterID),
    contract.getAllOngoing(characterID),
    contract.getAllFinalized(characterID)
  ]).then((contracts) => {
    const pending = contracts[0]
    const ongoing = contracts[1]
    const finalized = contracts[2]
    
    res.render("pages/eve/contracts", {
      character: req.session.character || {},
      pendingContracts: pending,
      ongoingContracts: ongoing,
      finalizedContracts: finalized,
      director: req.session.character.director,
      freighter: freighter,
      title: "Contracts - Mango Deliveries",
      active: "Contracts"
    })
  })
})

router.post("/contracts/submit", eveAuth, function(req, res) {
  const freighter = req.session.character.freighter || req.session.character.director
  if(!freighter) return res.sendStatus(403)
  
  Promise.all([
    eveHelper.contracts.accept(req),
    eveHelper.contracts.flag(req),
    eveHelper.contracts.complete(req),
    eveHelper.contracts.tax(req)
  ]).then(() => {
    return res.sendStatus(200)
  }).catch((errorID) => {
    return res.status(403).json({
      alert: `Contract #${errorID} was modified by someone else. Please reload the page.`
    })
  })
})

router.get("/director", eveAuth, async function(req, res) {
  if(!req.session.character.director) return res.redirect("/eve/eve")
  
  const freighters = await character.getFreighters()
  const bannedItemTypes = await invTypes.getBanned()
  const bannedMarketGroups = await invMarketGroups.getBanned()
  res.render("pages/eve/director", {
    character: req.session.character || {},
    title: "Director Panel - Mango Deliveries",
    active: "Director Panel",
    freighters: freighters,
    bannedItemTypes: bannedItemTypes,
    bannedMarketGroups: bannedMarketGroups
  })
})

router.post("/director/submit", eveAuth, async function(req, res) {
  if(!req.session.character.director) return res.sendStatus(403)
  
  var action = req.body.action
  var response
  if(req.body.freighter) response = await eveHelper.director.freighter(req.body.freighter, action)
  if(req.body.item) response = await eveHelper.director.itemType(req.body.item, action)
  if(req.body.group) response = await eveHelper.director.marketGroup(req.body.group, action)
  
  if(!response) return res.sendStatus(400)
  if(response.error) return res.status(404).json({ alert: response.alert })
  return res.status(200).json(response)
})

module.exports = router
