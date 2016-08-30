"use strict"

class TranslatorHandler {
  constructor() {};
};

TranslatorHandler.prototype.translate = function(msg, languagein, languageout) {
  translate.text({input: languagein, output: languageout}, msg, function(err, res) {
    if(err) { console.log(err); };
    return res;
  });
};

module.exports = TranslatorHandler;
