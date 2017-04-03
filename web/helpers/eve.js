//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const alliance = require("../models/eve/alliance")
const async = require("async")
const character = require("../models/eve/character")
const contract = require("../models/eve/contract")
const corporation = require("../models/eve/corporation")
const invMarketGroups = require("../models/eve/invmarketgroups")
const invTypes = require("../models/eve/invtypes")
const invVolumes = require("../models/eve/invvolumes")
const request = require("request-promise")
const url = require("url")
const winston = require("winston")

module.exports = {
  nShortener(num, digits = 2) {
    var si = [
      { value: 1E18, symbol: "E" },
      { value: 1E15, symbol: "P" },
      { value: 1E12, symbol: "T" },
      { value: 1E9,  symbol: "B" },
      { value: 1E6,  symbol: "M" },
      { value: 1E3,  symbol: "k" }
    ]
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    for (var i = 0; i < si.length; i++) {
      if (num >= si[i].value) {
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol
      }
    }
    return num.toFixed(digits).replace(rx, "$1")
  },

  validateAppraisal(query) {
    return new Promise((resolve) => {
      const link = query.link && typeof query.link === "string" ? url.parse(query.link) : null
      const multiplier = query.multiplier ? parseInt(query.multiplier, 10) : 1
      const destination = query.destination

      if(!link) return resolve({ invalid: { "#link": "Invalid link." } })
      if(!["evepraisal.com", "skyblade.de"].includes(link.hostname)) {
        return resolve({ invalid: { "#link": "Invalid link." } })
      }
      if(!multiplier) return resolve({ invalid: { "#multiplier": "Invalid multiplier." } })
      if(!destination) return resolve({ invalid: { "#destination": "Invalid destination. Click one of the station images above." } })

      var response = { invalid: {} }
      var appraisal
      request.get(`${link.href}.json`).then((body) => {
        appraisal = JSON.parse(body)

        return Promise.all([
          this.filterBannedItemTypes(appraisal),
          this.filterBannedMarketGroups(appraisal),
          this.fixShipVolumes(appraisal)
        ])
      }).then((promises) => {
        const bannedItemTypes = promises[0]
        const bannedMarketGroups = promises[1]

        var string
        if(appraisal.market_name !== "Jita") {
          string = "Appraisal market must be Jita.\n"
          response.invalid["#link"] = response.invalid["#link"] ?
            response.invalid["#link"].concat(string) : string
        }
        if(appraisal.totals.volume * multiplier > 300000) {
          string = "Total cargo volume is over 300.000m³.\n"
          response.invalid["#link"] = response.invalid["#link"] ?
            response.invalid["#link"].concat(string) : string
        }
        
        if(bannedItemTypes.length > 0) {
          string = "Your appraisal contains banned items:\n"
          _.forEach(bannedItemTypes, (item) => {
            string = string.concat(`${item.typeName}\n`)
          })
          response.invalid["#link"] = response.invalid["#link"] ?
            response.invalid["#link"].concat(string) : string
        }
        if(bannedMarketGroups.length > 0) {
          string = "Your appraisal contains items from banned market groups:\n"
          _.forEach(bannedMarketGroups, (item) => {
            string = string.concat(`${item.typeName}\n`)
          })
          response.invalid["#link"] = response.invalid["#link"] ?
            response.invalid["#link"].concat(string) : string
        }
        
        if(!_.isEmpty(response.invalid)) return resolve(response)
        return resolve(appraisal)
      }).catch((e) => {
        winston.error(e)
        resolve({ invalid: { "#link": "Invalid appraisal." } })
      })
    })
  },

  async filterBannedItemTypes(appraisal) {
    return new Promise(async (resolve) => {
      const bannedTypes = await invTypes.getBanned()
      const bannedTypeIDs = _.pluck(bannedTypes, "typeID")
      
      async.filter(appraisal.items, async (item, callback) => {
        item = await invTypes.get(item.typeID)
        item = item[0]
        callback(null, bannedTypeIDs.includes(item.typeID))
      }, function(e, results) {
        resolve(results)
      })
    })
  },
  
  async filterBannedMarketGroups(appraisal) {
    return new Promise(async (resolve) => {
      const bannedMarketGroups = await invMarketGroups.getBanned()
      const bannedMarketGroupIDs = _.pluck(bannedMarketGroups, "marketGroupID")
      
      async.filter(appraisal.items, async (item, callback) => {
        item = await invTypes.get(item.typeID)
        item = item[0]
        const groups = await invMarketGroups.getAllParentsByID(item.marketGroupID)
        callback(null, _.intersection(bannedMarketGroupIDs, groups).length > 0)
      }, function(e, results) {
        resolve(results)
      })
    })
  },

  fixShipVolumes(appraisal) {
    appraisal.totals.volume = 0

    return new Promise((resolve) => {
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
  },
  
  contracts: {
    accept(req) {
      return new Promise((resolve, reject) => {
        async.forEach(req.body.accept, async (id, callback) => {
          var oldContract = await contract.get(id)
          oldContract = oldContract[0]
          if(!oldContract || !["pending", "flagged"].includes(oldContract.status)) return callback(id)
          oldContract.status = "ongoing"
          oldContract.freighter_id = req.session.character.character_id
          oldContract.freighter_name = req.session.character.character_name
          contract.set(oldContract)
          return callback()
        }, function(errorID) {
          if(errorID) return reject(errorID)
          return resolve()
        })
      })
    },
    flag(req) {
      return new Promise((resolve, reject) => {
        async.forEach(req.body.flag, async (id, callback) => {
          var oldContract = await contract.get(id)
          oldContract = oldContract[0]
          if(!oldContract || oldContract.status !== "pending") return callback(id)
          oldContract.status = "flagged"
          contract.set(oldContract)
          return callback()
        }, function(errorID) {
          if(errorID) return reject(errorID)
          return resolve()
        })
      })
    },
    complete(req) {
      return new Promise((resolve, reject) => {
        async.forEach(req.body.complete, async (id, callback) => {
          var oldContract = await contract.get(id)
          oldContract = oldContract[0]
          if(!oldContract || oldContract.status !== "ongoing") return callback(id)
          oldContract.status = "completed"
          contract.set(oldContract)
          return callback()
        }, function(errorID) {
          if(errorID) return reject(errorID)
          return resolve()
        })
      })
    },
    tax(req) {
      return new Promise((resolve, reject) => {
        async.forEach(req.body.tax, async (id, callback) => {
          var oldContract = await contract.get(id)
          oldContract = oldContract[0]
          if(!oldContract || oldContract.status !== "completed" || oldContract.taxed) return callback(id)
          oldContract.taxed = true
          contract.set(oldContract)
          return callback()
        }, function(errorID) {
          if(errorID) return reject(errorID)
          return resolve()
        })
      })
    }
  },
  
  director: {
    async user(name, action) {
      switch(action) {
      case "ban":
        var user = await character.getByName(name)
        user = user[0]
        if(user.director) return { error: true, alert: `You can't ban ${name}, he's a director.` }
        character.ban(name)
        return { alert: `Banned ${name}.` }
      case "unban":
        character.unban(name)
        return { alert: `Unbanned ${name}.` }
      default:
        return false
      }
    },
    async freighter(name, action) {
      var user = await character.getByName(name)
      user = user[0]
      if(!user) return { error: true, alert: `Character ${name} doesn't exist.` }
      
      switch(action) {
      case "add":
        user.freighter = true
        character.set(user)
        return { alert: `Added ${name} to the list of freighters.` }
      case "remove":
        user.freighter = false
        character.set(user)
        return { alert: `Removed ${name} from the list of freighters.` }
      default:
        return false
      }
    },
    async alliance(name, action) {
      const allowed = await alliance.isAllowed(name)
      switch(action) {
      case "allow":
        if(allowed[0]) return { error: true, alert: `Alliance ${name} is already whitelisted.` }
        alliance.allow(name)
        return { alert: `Players in the alliance ${name} are now allowed to submit contracts.` }
      case "disallow":
        if(!allowed[0]) return { error: true, alert: `Alliance ${name} isn't whitelisted.` }
        alliance.disallow(name)
        return { alert: `Players in the alliance ${name} are no longer allowed to submit contracts.` }
      default:
        return false
      }
    },
    async corporation(name, action) {
      const allowed = await corporation.isAllowed(name)
      switch(action) {
      case "allow":
        if(allowed[0]) return { error: true, alert: `Corporation ${name} is already whitelisted.` }
        corporation.allow(name)
        return { alert: `Players in the corporation ${name} are now allowed to submit contracts.` }
      case "disallow":
        if(!allowed[0]) return { error: true, alert: `Corporation ${name} isn't whitelisted.` }
        corporation.disallow(name)
        return { alert: `Players in the corporation ${name} are no longer allowed to submit contracts.` }
      default:
        return false
      }
    },
    async itemType(item, action) {
      var invItem
      if(+item) {
        invItem = await invTypes.get(+item)
      } else {
        invItem = await invTypes.getByName(item)
      }
      
      invItem = invItem[0]
      if(!invItem) return { error: true, alert: `Item type ${item} doesn't exist.` }
      
      switch (action) {
      case "ban":
        invTypes.ban(invItem)
        return { alert: `Banned item ${item} from appraisals.` }
      case "allow":
        invTypes.allow(invItem.typeID)
        return { alert: `Item ${item} is no longer banned from appraisals.` }
      default:
        return false
      }
    },
    async marketGroup(group, action) {
      var groups
      if(+group) {
        groups = await invMarketGroups.get(+group)
      } else {
        groups = await invMarketGroups.getByName(group)
      }
      
      if(groups.length > 1) {
        var alert = "Multiple market groups exist with that name, please input an ID:\n"
        _.forEach(groups, (group) => {
          alert = alert.concat(`${group.marketGroupID} ${group.marketGroupName}: ${group.description}\n`)
        })
        return { error: true, alert: alert }
      }
      
      var invGroup = groups[0]
      if(!invGroup) return { error: true, alert: `Market group ${group} doesn't exist` }
      
      switch(action) {
      case "ban":
        invMarketGroups.ban(invGroup)
        return { alert: `Banned market group ${group} from appraisals` }
      case "allow":
        invMarketGroups.allow(invGroup.marketGroupID)
        return { alert: `Market group ${group} is no longer banned from appraisals.` }
      default:
        return false
      }
    }
  }
}
