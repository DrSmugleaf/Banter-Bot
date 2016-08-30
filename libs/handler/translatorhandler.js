"use strict"
const Discord = require ("discord.js");
const discord = new Discord.Client();
const translate = require("yandex-translate")(process.env.YANDEX_KEY);

class TranslatorHandler {
  constructor() {
    this.channel;
    this.input;
    this.output;
  };
};

TranslatorHandler.prototype.translate = function(msg) {
  if(msg.channel === "development") {
    this.channel = "serbia";
    this.input = "Spanish";
    this.output = "English";
  } else if(msg.channel === "serbia") {
    this.channel = "development";
    this.input = "English";
    this.output = "Spanish";
  };

  translate.translate(msg, {from: this.input, to: this.output}, function(err, res) {
    if(err) { console.log(err); };
    discord.sendMessage(this.channel, res);
  });
};

module.exports = TranslatorHandler;
