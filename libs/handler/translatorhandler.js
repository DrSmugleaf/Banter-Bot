"use strict"
const ArrayUtil = require("../util/arrayutil");
const arrayutil = new ArrayUtil();
const translate = require("yandex-translate")(process.env.YANDEX_KEY);
const key = process.env.YANDEX_KEY;

class TranslatorHandler {
  constructor(discord, opts) {
    this.discord = discord;
    this.opts = opts;
  };
};

TranslatorHandler.prototype.translate = function(discord, msg, opts) {
  if(opts[msg.channel.name]) {
    let language = opts[msg.channel.name];
    for(let channel in opts) {
      if(opts[channel] == opts[msg.channel.name]) { continue; };
      translate.translate(msg.content, {from: language, to: opts[channel]}, function(err, res) {
        if(err) { console.log(err); };
        discord.sendMessage(discord.channels.get("name", channel), res.text[0]);
      });
    };
  };
};

// TranslatorHandler.prototype.bridgeChannels = function() {
//   var that = this;
//   this.discord.on("message", function(msg) {
//     var opts = arrayutil.clone(this.opts);
//     if(opts[msg.channel.name]) {
//       let language = opts[msg.channel.name];
//       // delete opts[msg.channel.name];
//       for(let channel in opts) {
//         if(channel == opts[msg.channel.name]) { next; };
//         translate.translate(msg.content, {from: language, to: opts[channel]}, function(err, res) {
//           if(err) { console.log(err); };
//           that.discord.sendMessage(that.discord.channels.get("name", channel), res.text[0]);
//         });
//       };
//     };
//   });
// }

// TranslatorHandler.prototype.bridgeChannels = function(discord, opts) {
//   var that = this;
//   this.opts = opts;
//   discord.on("message", function(msg) {
//     console.log(this.opts);
//     console.log( opts);
//     let i = that.opts.length;
//     while(i--) opts[i] = that.opts[i];
//     console.log(this.opts);
//     console.log(opts);
//     if(opts[msg.channel.name]) {
//       let language = opts[msg.channel.name];
//       delete opts[msg.channel.name];
//       for(let channel in opts) {
//         translate.translate(msg.content, {from: language, to: opts[channel]}, function(err, res) {
//           if(err) { console.log(err); };
//           discord.sendMessage(discord.channels.get("name", channel), res.text[0]);
//         });
//       };
//     };
//   });
// };

// TranslatorHandler.prototype.translate = function(msg, discord) {
//   console.log(msg.channel.name);
//   if(msg.channel.name == "development") {
//     console.log(msg.channel.id);
//     this.channel = discord.channels.get("name", "serbia");
//     this.input = "Spanish";
//     this.output = "English";
//   } else if(msg.channel.name == "serbia") {
//     this.channel = discord.channels.get("name", "development");
//     this.input = "English";
//     this.output = "Spanish";
//   } else { return; };
//   this.discord = discord;
//   var that = this;
//   translate.translate(msg.content, {from: this.input, to: this.output, key: key}, function(err, res) {
//     if(err) { console.log(err); };
//     console.log(that.discord.sendMessage);
//     console.log(that.channel);
//     console.log(res.text[0]);
//     that.discord.sendMessage(that.channel, res.text[0]);
//   });
// };

module.exports = TranslatorHandler;
