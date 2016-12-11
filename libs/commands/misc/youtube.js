//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const constants = require("../../util/constants")
const commando = require("discord.js-commando")
const request = require("request")
const streamoptions = {seek: 0, volume: 0.25}
const validurl = require("valid-url")
const winston = require("winston")
const ytdl = require("ytdl-core")

// class Youtube extends CommandBase {
//   constructor() {
//     super()
//   }
// }
// // recognize !youtube <link> as !youtube play <link>
// Youtube.prototype.play = function(msg) {
//   if(!msg.guild || !msg.guild.available) {
//     msg.channel.sendMessage(constants.responses.NOT_A_SERVER(msg.language))
//     return
//   }
//   if(!msg.member.voiceChannel) {
//     msg.reply(constants.responses.NOT_A_VOICE_CHANNEL[msg.language])
//     return
//   }
//   // fix crashing with http weblinks
//   if(validurl.isUri(this.commandtext[2])) {
//     https.get(this.commandtext[2], function(res) {
//       if(res.statusCode == 200) {
//         msg.member.voiceChannel.join()
//           .then(voiceconnection => {
//             let stream = ytdl(msg.content, {filter: "audioonly"})
//             let dispatcher = voiceconnection.playStream(stream, streamoptions)
//             dispatcher.on("end", () => {
//               voiceconnection.disconnect()
//             })
//           })
//           .catch(winston.error)
//       }
//     })
//   } else {
//     msg.reply(constants.responses.YOUTUBE.INVALID[msg.language])
//     return
//   }
// }
//
// Youtube.prototype.pause = function(msg) {
//   // fix this.video.pause() cannot read property pause of undefined
//   msg.guild.player.dispatcher.pause()
// }
//
// module.exports = Youtube


module.exports = class Youtube extends commando.Command {
  constructor(client) {
    super(client, {
      name: "youtube",
      aliases: ["youtube, yt"],
      group: "misc",
      memberName: "youtube",
      description: "Play a video's sound from youtube to your voice channel",
      examples: ["youtube https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      args: [
        {
          key: "url",
          prompt: "What video do you want to hear?",
          type: "string"
        }
      ]
    })
  }

  async run(msg, args) {
    if(!msg.guild || !msg.guild.available) {
      msg.reply(constants.responses.NOT_A_SERVER["english"])
      return
    }
    if(!msg.member.voiceChannel) {
      msg.reply(constants.responses.NOT_A_VOICE_CHANNEL["english"])
      return
    }

    const url = args.url
    if(validurl.isUri(url)) {
      request(url, function(e, res, body) {
        if(!e && res.statusCode == 200) {
          msg.member.voiceChannel.join()
            .then(voiceconnection => {
              let stream = ytdl(url, {filter: "audioonly"})
              let dispatcher = voiceconnection.playStream(stream, streamoptions)
              dispatcher.on("end", () => {
                voiceconnection.disconnect()
              })
            })
            .catch(winston.error)
        }
      })
    } else {
      msg.reply(constants.responses.YOUTUBE.INVALID["english"])
      return
    }
  }
}
