//
// Copyright (c) 2016 DrSmugleaf
//

// "use strict"
// const constants = require("../../util/constants")
// const commando = require("discord.js-commando")
// const DB = require("../../util/db.js")
// const db = new DB()
// const winston = require("winston")
//
// module.exports = class Quote extends commando.Command {
//   constructor(client) {
//     super(client, {
//       name: "quote",
//       aliases: ["quote"],
//       group: "misc",
//       memberName: "quote",
//       description: "Add, remove or get a quote from the list",
//       examples: ["quote", "quote 25", "quote add Hello World", "quote del 25"],
//       args: [
//         {
//           key: "mode",
//           prompt: "Add, delete, or get a quote",
//           type: "string",
//           default: "get"
//         },
//         {
//           key: "id",
//           prompt: "ID of the quote to add or delete",
//           type: "integer",
//           default: undefined
//         },
//         {
//           key: "text",
//           prompt: "Text of the quote to add to the list of quotes",
//           type: "string",
//           default: undefined
//         }
//       ]
//     })
//   }
//
//   async quoteAdd(msg, text) {
//     if(!text) {
//       msg.reply(constants.responses.QUOTE.EMPTY["english"])
//       return
//     }
//
//     db.query("INSERT INTO quotes (text, submitter) VALUES ($1::text, $2::text) RETURNING id", [quote, msg.author.username], "one")
//       .then(data => msg.reply(constants.responses.QUOTE.ADDED["english"]))
//   }
//
//   async quoteDel(msg, id) {
//     db.query("DELETE FROM quotes WHERE id=$1::int RETURNING id", [id], "one")
//       .then(data => {
//         db.cleanTable("quotes")
//         msg.channel.sendMessage(constants.responses.QUOTE.REMOVED["english"](data.id))
//       })
//       .catch(e => {
//         winston.error(e)
//         msg.channel.sendMessage(constants.responses.QUOTE.INVALID["english"])
//       })
//   }
//
//   async quoteGet(msg, id) {
//     let query
//     let values
//     if(!id) {
//       query = "SELECT id, text, submitter FROM quotes OFFSET random() * (SELECT count(*)-1 FROM quotes) LIMIT 1"
//       values = null
//     } else {
//       query = "SELECT * FROM quotes WHERE id=$1::int"
//       values = [id]
//     }
//
//     db.query(query, values, "one")
//       .then(data => msg.reply(constants.responses.QUOTE.GET["english"](data.id, data.text)))
//       .catch(e => {
//         winston.error(e)
//         msg.reply(constants.responses.QUOTE.MISSING["english"])
//       })
//   }
//
//   async run(msg, args) {
//     const mode = args.mode
//     const id = args.id
//     const text = args.text
//
//     if(mode == "add") {
//       quoteAdd(msg, text)
//     } else if(mode == "del" || mode == "delete" || mode == "remove") {
//       quoteDel(msg, id)
//     } else if(mode == "get") {
//       quoteGet(msg, id)
//     }
//   }
// }

// "use strict"
// const commando = require("discord.js-commando")
// const constants = require("../../util/constants")
// const DB = require("../../util/db")
// const db = new DB()
// const modes = ["add", "get", "del", "delete"]
// const winston = require("winston")
//
// module.exports = class Quote extends commando.Command {
//   constructor(client) {
//     super(client, {
//       name: "quote",
//       aliases: ["quote"],
//       group: "misc",
//       memberName: "quote",
//       description: "",
//       examples: ["quote", "quote 5", "quote del 5", "quote add HeyGuys"],
//       args: [
//         {
//           key: "mode",
//           prompt: "Do you want to get, add or delete a quote?",
//           type: "string",
//           default: "get",
//           validate: value => {
//             return modes.includes(value)
//           }
//         },
//         {
//           key: "id",
//           prompt: "What quote do you want to get or delete?",
//           type: "integer",
//           default: "any"
//         },
//         {
//           key: "text",
//           prompt: "What text do you want to add as a quote?",
//           type: "string",
//           default: "none",
//           validate: (value, msg, arg) => {
//             winston.info(this.mode)
//           }
//         }
//       ]
//     })
//   }
//
//   async quoteAdd(msg, text) {
//     db.query("INSERT INTO quotes (text, submitter) VALUES ($1::text, $2::text) RETURNING id", [text, msg.author.username], "one")
//       .then(data => msg.reply(constants.responses.QUOTE.ADDED["english"](data.id)))
//   }
//
//   async quoteDel(msg, id) {
//     db.query("DELETE FROM quotes WHERE id=$1::int RETURNING id", [id], "one")
//       .then(data => {
//         db.cleanTable("quotes")
//         msg.reply(constants.responses.QUOTE.REMOVED["english"](data.id))
//       })
//       .catch(e => {
//         winston.error(e)
//         msg.reply(constants.responses.QUOTE.INVALID["english"])
//       })
//   }
//
//   async quoteGet(msg, id) {
//     let query
//     let values
//     if(id === "any") {
//       query = "SELECT id, text, submitter FROM quotes OFFSET random() * (SELECT count(*)-1 FROM quotes) LIMIT 1"
//       values = null
//     } else {
//       query = "SELECT * FROM quotes WHERE id=$1::int"
//       values = [id]
//     }
//
//     db.query(query, values, "one")
//       .then(data => msg.reply(constants.responses.QUOTE.GET["english"](data.id, data.text)))
//       .catch(e => {
//         winston.error(e)
//         msg.reply(constants.responses.QUOTE.MISSING["english"])
//       })
//   }
//
//   async run(msg, args) {
//     const mode = args.mode
//     const id = args.id
//     const text = args.text
//
//     switch(mode) {
//     case "add":
//       this.quoteAdd(msg, text)
//       break;
//     case "del":
//     case "delete":
//       this.quoteDel(msg, id)
//       break;
//     case "get":
//       this.quoteGet(msg, id)
//       break;
//     default:
//
//     }
//   }
// }
