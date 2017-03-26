//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const async = require("async")
const invMarketGroups = require("../models/eve/invmarketgroups")
const invTypes = require("../models/eve/invtypes")
const invVolumes = require("../models/eve/invvolumes")
const request = require("request-promise")
const url = require("url")
const winston = require("winston")

module.exports = {
  nFormatter(num, digits) {
    var si = [
      { value: 1E18, symbol: "E" },
      { value: 1E15, symbol: "P" },
      { value: 1E12, symbol: "T" },
      { value: 1E9,  symbol: "B" },
      { value: 1E6,  symbol: "M" },
      { value: 1E3,  symbol: "k" }
    ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i
    for (i = 0; i < si.length; i++) {
      if (num >= si[i].value) {
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol
      }
    }
    return num.toFixed(digits).replace(rx, "$1")
  },
  
  validateAppraisal(req) {
    return new Promise((resolve, reject) => {
      const link = url.parse(req.query.link)
      const multiplier = req.query.multiplier ? parseInt(req.query.multiplier, 10) : 1
      
      if(!link) return resolve({ invalid: { "#link": "Invalid link." } })
      if(!["evepraisal.com", "skyblade.de"].includes(link.hostname)) {
        return resolve({ invalid: { "#link": "Invalid link." } })
      }
      if(!multiplier) return resolve({ invalid: { "#multiplier": "Invalid multiplier." } })
    
      var response = { invalid: {} }
      var appraisal
      request.get(`${link.href}.json`).then((body) => {
        appraisal = JSON.parse(body)
        
        return Promise.all([
          this.filterBannedItems(appraisal),
          this.fixShipVolumes(appraisal)
        ])
      }).then((promises) => {
        const bannedItems = promises[0]
        
        if(appraisal.market_name !== "Jita") {
          response.invalid["#link"] += "Appraisal market must be Jita.\n"
        }
        if(appraisal.totals.volume * multiplier > 300000) {
          response.invalid["#link"] += "Total cargo volume is over 300.000m³.\n"
        }
        if(bannedItems.length > 0) {
          response.invalid["#link"] += "Your appraisal contains items from the Manufacture & Research or Blueprints market groups.\n"
        }
        
        if(!_.isEmpty(response.invalid)) return resolve(response)
        return resolve(appraisal)
      }).catch((e) => {
        winston.error(e)
        resolve({ invalid: { "#link": "Invalid appraisal." } })
      })
    })
  },
  
  async filterBannedItems(appraisal) {
    // 2: Blueprints
    // 475: Manufacture & Research
    const banned = [2, 475]
    
    return new Promise((resolve, reject) => {
      async.filter(appraisal.items, async (item, callback) => {
        item = await invTypes.get(item.typeID)
        const group = await invMarketGroups.getHighestParentID(item[0].marketGroupID)
        callback(null, banned.includes(group[0].marketGroupID))
      }, function(e, results) {
        resolve(results)
      })
    })
  },
  
  fixShipVolumes(appraisal) {
    appraisal.totals.volume = 0
    
    return new Promise((resolve, reject) => {
      async.eachOf(appraisal.items, async (item, key, callback) => {
        const invVolumesItem = await invVolumes.get(item.typeID)
        if(invVolumesItem.length < 1) return callback()
        appraisal.items[key].volume = invVolumesItem[0].volume
        appraisal.totals.volume += invVolumesItem[0].volume
        return callback()
      }, function() {
        resolve()
      })
    })
  }
}