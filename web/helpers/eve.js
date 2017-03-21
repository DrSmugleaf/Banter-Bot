//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const async = require("async")
const invMarketGroups = require("../models/eve/invmarketgroups")
const invTypes = require("../models/eve/invtypes")
const request = require("request-promise")
const url = require("url")

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
      if(!(link && ["evepraisal.com", "skyblade.de"].includes(link.hostname))) {
        return resolve({ invalid: { "#link": "Invalid link." } })
      }
      if(!multiplier) return resolve({ invalid: { "#multiplier": "Invalid multiplier." } })
      
      request.get(`${link.href}.json`).then(async (body) => {
        body = JSON.parse(body)
        var response = { invalid: { "#link": "" } }
        
        if(body.market_name !== "Jita") {
          response.invalid["#link"] += "Appraisal market must be Jita.\n"
        }
        if(body.totals.volume > 300000) {
          response.invalid["#link"] += "Volume is over 300.000m³.\n"
        }
        async.filter(body.items, async (item, callback) => {
          item = await invTypes.get(item.typeID)
          const group = await invMarketGroups.getHighestParentID(item[0].marketGroupID)
          // 475: Manufacture & Research
          // 2: Blueprints
          callback(null, [475, 2].includes(group[0].marketGroupID))
        }, function(e, results) {
          if(results.length > 0) {
            response.invalid["#link"] += "Your appraisal contains items from the Manufacture & Research or Blueprints market groups.\n"
          }
          return resolve(response)
        })
        
        return resolve(body)
      }).catch((e) => {
        resolve({ invalid: { "#link": "Invalid appraisal." } })
      })
    })
  }
}