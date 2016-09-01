"use strict"
const LOADDIR = "../../sounds";

class Coult {
  constructor() {};
};

Coult.prototype.trapCard = function(discord, msg) {
  msg.author.voiceChannel.join(function(e, connection) {
    if(e) { throw e; };
      connection.playFile("./trapcard.mp3", function(e) {
    });
  });
};

module.exports = Coult;
