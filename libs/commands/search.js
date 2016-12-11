//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
// const async = require("async")
// //const CommandBase = require("./commandbase")
// const constants = require("../util/constants")
// const Discord = require("discord.js")
// const os = require("os")
// const winston = require("winston")
//
// class Search extends CommandBase {
//   constructor() {
//     super()
//   }
// }
//
// Search.prototype.default = function(msg) {
//   let sentences = new Discord.Collection()
//   let searchword = this.command[1]
//   let i = 0
//   let lastmessageid = msg.id
//   let result = ""
//
//   if(!msg.guild || !msg.guild.available) {
//     msg.reply(constants.responses.NOT_A_SERVER(msg.language))
//     return
//   }
//
//   async.whilst(
//     function() { return sentences.array().length < 1000 && i < 100 },
//     function(next) {
//       msg.channel.fetchMessages({limit: 100, before: lastmessageid})
//         .then(messages => {
//           if(!messages.last()) {
//             i = 100
//             next(null, lastmessageid, sentences)
//           }
//           lastmessageid = messages.last().id
//           sentences = sentences.concat(messages)
//           winston.info(sentences.array().length)
//           i++
//           next(null, lastmessageid, sentences)
//         })
//         .catch(winston.error)
//     },
//     function(e, lastmessageid, sentences) {
//       if(e) winston.error(e)
//       sentences = sentences.filter(m => m.content.includes(searchword))
//       // let sentenceskeys = sentences.keyArray()
//       // for(let id in sentences.keyArray()) {
//       //   winston.info(sentences[sentenceskeys[id]])
//       // }
//       sentences.forEach(function(element) {
//         winston.info(element)
//       })
//     }
//   )
// }
//
// module.exports = Search
