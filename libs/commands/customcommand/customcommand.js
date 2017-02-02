//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const winston = require("winston")
const youtube = require("../youtube/base/main")
const ytdl = require("ytdl-core")

module.exports = class CustomCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "custom-command",
      aliases: [
        "custom-command", "customcommand",
        "custom-cmd", "customcmd",
        "custom-command-admin", "customcommandadmin",
        "custom-cmd-admin", "customcmdadmin"
      ],
      group: "customcommand",
      memberName: "custom-command",
      description: "Make a basic custom command",
      examples: ["customcommand rickroll voice self https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "mode",
          prompt: "What do you want to do? Add or remove",
          type: "string",
          validate: (mode) => {
            if(["add", "remove"].includes(mode)) return true
            return false
          }
        },
        {
          key: "name",
          prompt: "What name do you want for your command?",
          type: "string"
        },
        {
          key: "type",
          prompt: "What type do you want your command to be? Text or voice",
          type: "string",
          validate: (type) => {
            if(["text", "voice"].includes(type)) return true
            return false
          }
        },
        {
          key: "target",
          prompt: "Who do you want your command to target? Username or self",
          type: "string",
          validate: (target) => {
            if(["username", "self"].includes(target)) return true
            return false
          },
          default: ""
        },
        {
          key: "textOrVideo",
          prompt: "What text do you want the bot to type or what song do you want the bot to play when the command is used?",
          type: "string",
          default: ""
        }
      ]
    })

    this.command = (command) => {
      return class Custom extends commando.Command {
        constructor(client) {
          super(client, {
            name: command.name,
            group: "customcommand",
            memberName: command.name,
            description: "Custom command.",
            guildOnly: true,
            throttling: {
              usages: 2,
              duration: 3
            },
            args: command.target === "username" ? [
              {
                key: "target",
                prompt: "Which member do you want to target?",
                type: "member"
              }
            ] : null
          })

          this.type = command.type
          this.target = command.target
          this.text = command.text
          this.video = command.video
        }

        hasPermission(msg) {
          return msg.guild.id === command.guild.id
        }

        async run(msg, args) {
          const member = command.target === "username" ? args.target : msg.member

          if(this.type === "text") {
            return msg.channel.sendMessage(`<@${member.id}>, ${command.text}`)
          } else if(this.type === "voice") {
            if(youtube.isCurrentlyPlaying(msg.guild)) {
              return msg.reply(constants.responses.CUSTOM_COMMAND.CURRENTLY_PLAYING[msg.language])
            }
            if(!youtube.isMemberInVoiceChannel(member)) {
              return msg.reply(constants.responses.CUSTOM_COMMAND.NOT_IN_VOICE_CHANNEL[msg.language](member.displayName))
            }

            const voicePermissions = member.voiceChannel.permissionsFor(msg.client.user)
            if(!voicePermissions.hasPermission("CONNECT")) {
              return msg.reply(constants.responses.CUSTOM_COMMAND.CANT_CONNECT[msg.language])
            }
            if(!voicePermissions.hasPermission("SPEAK")) {
              return msg.reply(constants.responses.CUSTOM_COMMAND.CANT_SPEAK[msg.language])
            }

            youtube.joinVoice(member.voiceChannel).then(voiceConnection => {
              const stream = ytdl(command.video, { filter: "audioonly" }).on("error", (e) => {
                winston.error(e)
                return msg.reply(constants.responses.CUSTOM_COMMAND.YTDL_ERROR[msg.language](command.video))
              })

              voiceConnection.playStream(
                stream, constants.youtube.STREAM_OPTIONS
              ).on("error", (e) => {
                winston.error(e)
                return msg.reply(constants.responses.CUSTOM_COMMAND.DISPATCHER_ERROR[msg.language])
              })
            })
          }
        }
      }
    }

    this.setup()
    this.client.on("dbReady", () => {
      winston.info(1)
      this.client.guilds.forEach((guild) => {
        const commands = guild.settings.get("custom-commands")
        winston.info(commands)
        for(const customCommand in commands) {
          if(!commands.hasOwnProperty(customCommand)) return

          commands[customCommand].guild = guild
          const command = this.command(commands[customCommand])
          this.client.registry.registerCommand(command)
        }
      })
    })
  }

  setup() {

  }

  hasPermission(msg) {
    return msg.member.hasPermission("ADMINISTRATOR")
  }

  async run(msg, args) {
    const mode = args.mode
    const name = args.name
    const type = args.type
    const target = args.target
    const text = type === "text" ? args.textOrVideo : null
    const video = type === "voice" ? args.textOrVideo : null

    if(mode === "add") {
      if(this.client.registry.commands.get(name)) {
        return msg.reply(constants.responses.CUSTOM_COMMAND.ALREADY_EXISTS[msg.language](name))
      }

      const command = this.command({
        name: name,
        type: type,
        target: target,
        text: text,
        video: video,
        guild: msg.guild
      })
      this.client.registry.registerCommand(command)

      const commands = msg.guild.settings.get("custom-commands", {})
      commands[name] = {
        name: name,
        type: type,
        target: target,
        text: text,
        video: video
      }
      msg.guild.settings.set("custom-commands", commands)

      return msg.reply(constants.responses.CUSTOM_COMMAND.REGISTERED[msg.language](
        name, this.client.commandPrefix || `<@${msg.client.user.id}> `)
      )
    } else if(mode === "remove") {
      const command = this.client.registry.commands.get(name)
      if(!command) {
        return msg.reply(constants.respones.CUSTOM_COMMAND.DOESNT_EXIST[msg.language](name))
      }

      this.client.registry.unregisterCommand(command)
      return msg.reply(constants.responses.CUSTOM_COMMAND.UNREGISTERED[msg.language](name))
    }
  }
}
