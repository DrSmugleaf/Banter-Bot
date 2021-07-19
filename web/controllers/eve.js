//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const alliance = require("../models/eve/alliance")
const character = require("../models/eve/character")
const contract = require("../models/eve/contract")
const corporation = require("../models/eve/corporation")
const destination = require("../models/eve/destinations")
const eveAuth = require("../middlewares/eve").eveAuth
const eveHelper = require("../helpers/eve")
const express = require("express")
const invMarketGroups = require("../models/eve/invmarketgroups")
const invTypes = require("../models/eve/invtypes")
const moment = require("moment-timezone")
const router = express.Router()
const request = require("request-promise")
const session = require("express-session")
const SequelizeStore = require("connect-session-sequelize")(session.Store)
const Store = new SequelizeStore({
  db: require("../db")
})
const settings = require("../models/eve/settings")
const winston = require("winston")

router.use(session({
  name: "mango deliveries",
  secret: process.env.EVE_DELIVERIES_SESSION_SECRET,
  store: Store,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: true, maxAge: 1800000 }
}))

Store.sync()

router.get("/login", function(req, res) {
  const state = require("crypto").randomBytes(64).toString("hex")
  req.session.state = state
  res.redirect(`https://login.eveonline.com/oauth/authorize/?response_type=code&redirect_uri=${process.env.EVE_CALLBACK}&client_id=${process.env.EVE_ID}&state=${state}`)
})

router.get("/callback", function(req, res) {
  const sessionState = req.session.state
  delete req.session.state

  if(req.query.state !== sessionState) {
    return res.sendStatus(403)
  }

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
      request.get(`https://esi.evetech.net/latest/characters/${body.CharacterID}/`),
      request.get(`https://esi.evetech.net/latest/characters/${body.CharacterID}/portrait/`)
    ])
  }).then((bodies) => {
    _.forEach(bodies, (body, index) => {
      bodies[index] = JSON.parse(body)
    })
    eveCharacter.characterName = bodies[0].name
    eveCharacter.characterPortrait = bodies[1].px64x64.replace(/^http:\/\//i, "https://")
    eveCharacter.characterBirthday = moment(bodies[0].birthday).format("YYYY-MM-DD HH:mm:ss")
    eveCharacter.allianceId = bodies[0].alliance_id
    eveCharacter.corporationId = bodies[0].corporation_id

    if (eveCharacter.allianceId === undefined) {
      return Promise.all([
        request.get(`https://esi.evetech.net/latest/corporations/${eveCharacter.corporationId}/`),
        request.get(`https://esi.evetech.net/latest/corporations/${eveCharacter.corporationId}/icons/`)
      ])
    } else {
      return Promise.all([
        request.get(`https://esi.evetech.net/latest/corporations/${eveCharacter.corporationId}/`),
        request.get(`https://esi.evetech.net/latest/corporations/${eveCharacter.corporationId}/icons/`),
        request.get(`https://esi.evetech.net/latest/alliances/${eveCharacter.allianceId}/`),
        request.get(`https://esi.evetech.net/latest/alliances/${eveCharacter.allianceId}/icons/`)
      ])
    }
  }).then(async (bodies) => {
    _.forEach(bodies, (body, index) => {
      bodies[index] = JSON.parse(body)
    })

    eveCharacter.corporationName = bodies[0].name
    eveCharacter.corporationPortrait = bodies[1].px64x64.replace(/^http:\/\//i, "https://")

    if (bodies.length == 4) {
      eveCharacter.allianceName = bodies[2].alliance_name
      eveCharacter.alliancePortrait = bodies[3].px64x64.replace(/^http:\/\//i, "https://")
    }

    await character.set(eveCharacter)
    eveCharacter = await character.get(eveCharacter.id)

    const userBanned = await character.isBanned(eveCharacter.characterName)
    const allianceAllowed = eveCharacter.allianceName === undefined
      ? true
      : await alliance.isAllowed(eveCharacter.allianceName)
    const corporationAllowed = await corporation.isAllowed(eveCharacter.corporationName)
    const isDirector = eveCharacter.director
    const isFreighter = eveCharacter.freighter
    const isAllowed = !userBanned && (allianceAllowed[0] || corporationAllowed[0] || isDirector || isFreighter)

    if (!isAllowed) return res.render("pages/unauthorized")

    req.session.character = eveCharacter
    res.redirect("/")
  }).catch(e => {
    console.error(e)
    res.render("pages/404")
  })
})

router.get("/", async function(req, res) {
  res.render("pages/index", {
    character: req.session.character || {},
    destinations: await destination.getAll(),
    title: "Home - Mango Deliveries",
    active: "Home"
  })
})

router.get("/query", async function(req, res) {
  if(req.session.eveToken) {
    const eveCharacter = await character.getByToken(req.session.eveToken)
    req.session.character = eveCharacter[0]
  }
  if(!req.session.character) return res.status(403).json({
    alert: "You need to login before submitting contracts."
  })

  const eveCharacter = req.session.character

  const userBanned = await character.isBanned(eveCharacter.character_name)
  const allianceAllowed = await alliance.isAllowed(eveCharacter.alliance_name)
  const corporationAllowed = await corporation.isAllowed(eveCharacter.corporation_name)
  const isDirector = eveCharacter.director
  const isFreighter = eveCharacter.freighter
  const isAllowed = !userBanned[0] && (allianceAllowed[0] || corporationAllowed[0] || isDirector || isFreighter)

  if(!isAllowed) return res.status(403).json({
    alert: "You aren't allowed to submit contracts. Either you have been banned, or your corporation isn't whitelisted."
  })

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
  if(req.session.eveToken) {
    const eveCharacter = await character.getByToken(req.session.eveToken)
    req.session.character = eveCharacter[0]
  }
  if(!req.session.character) return res.status(403).json({
    alert: "You need to login before submitting contracts."
  })

  const eveCharacter = req.session.character

  const userBanned = await character.isBanned(eveCharacter.character_name)
  const allianceAllowed = await alliance.isAllowed(eveCharacter.alliance_name)
  const corporationAllowed = await corporation.isAllowed(eveCharacter.corporation_name)
  const isDirector = eveCharacter.director
  const isFreighter = eveCharacter.freighter
  const isAllowed = !userBanned[0] && (allianceAllowed[0] || corporationAllowed[0] || isDirector || isFreighter)

  if(!isAllowed) return res.status(403).json({
    alert: "You aren't allowed to submit contracts. Either you have been banned, or your corporation isn't whitelisted."
  })

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

  return res.status(200).json({
    alert: "Contract submitted. Click here to see it."
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

    res.render("pages/contracts", {
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
  const director = req.session.character.director
  const freighter = req.session.character.freighter
  if(!(director || freighter)) return res.sendStatus(403)
  if(req.body.tax && !director) return res.sendStatus(403)

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

  const bannedUsers = await character.getBanned()
  const freighters = await character.getFreighters()
  const allowedAlliances = await alliance.getAllowed()
  const allowedCorporations = await corporation.getAllowed()
  const bannedItemTypes = await invTypes.getBanned()
  const bannedMarketGroups = await invMarketGroups.getBanned()
  const eveSettings = await settings.get()
  res.render("pages/director", {
    character: req.session.character || {},
    title: "Director Panel - Mango Deliveries",
    active: "Director Panel",
    bannedUsers: bannedUsers,
    freighters: freighters,
    allowedAlliances: allowedAlliances,
    allowedCorporations: allowedCorporations,
    bannedItemTypes: bannedItemTypes,
    bannedMarketGroups: bannedMarketGroups,
    settings: eveSettings[0],
  })
})

router.post("/director/submit", eveAuth, async function(req, res) {
  if(!req.session.character.director) return res.sendStatus(403)

  var action = req.body.action
  var response
  if(req.body.user) response = await eveHelper.director.freighter(req.body.user, action)
  if(req.body.freighter) response = await eveHelper.director.freighter(req.body.freighter, action)
  if(req.body.alliance) response = await eveHelper.director.alliance(req.body.alliance, action)
  if(req.body.corporation) response = await eveHelper.director.corporation(req.body.corporation, action)
  if(req.body.item) response = await eveHelper.director.itemType(req.body.item, action)
  if(req.body.group) response = await eveHelper.director.marketGroup(req.body.group, action)
  if(req.body.object === "settings") response = await eveHelper.director.settings(req.body)
  if(req.body.object === "destination") response = await eveHelper.director.destination(req.body, action)

  if(!response) return res.sendStatus(400)
  if(response.error) return res.status(404).json({ alert: response.alert })
  return res.status(200).json(response)
})

module.exports = router
