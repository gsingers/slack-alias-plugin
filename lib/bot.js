var _ = require('underscore');
var slack = require('./slacker');
var slackbot = require('node-slackbot');

/**
 * Slackbot to integrate JIRA.
 *
 * The main thing it does right now is auto-expand links, but since we are bringing in the JIRA plugin, there is more it can do
 *
 * See config-example.js for configuration
 *
 * To run:  node config-XXX.js   (where XXX is the name of your config
 *
 * See:
 * https://www.npmjs.com/package/node-slackbot
 * https://www.npmjs.com/package/jira
 */
var Bot = function (config) {
  var self = this;
  this.config = _.defaults(config, {
    bot_name: "AliasBot",
    emoji: ":slack:",
    helpName: "ALIASHELP",
    post: true
  });

  this.slacker = new slack.Slacker({
    token: this.config.token
  });
  return this;
};

Bot.prototype.run = function () {
  var self = this,
      verbose = self.config.verbose,
      bot = new slackbot(this.config.token),
      pattern = "^(?!>).*(?:@)((";
  var len = _.keys(self.config.alias_maps).length;
  console.log(len);
   var helpTxt = "The following aliases are supported: \n";
  _.each(self.config.alias_maps, function (value, key, obj) {
    pattern += key;
    pattern += "|";
    helpTxt += key + "\n\t[" + value.join(", ") + "]\n ";
  });

  pattern += self.config.helpName + "))(?!`)";
  helpTxt += self.config.helpName;
  if (verbose) {
    console.log("Pattern is: " + pattern);
  }
  bot.use(function (message, cb) {
    if ('message' == message.type && message.text != null && message.subtype != "bot_message") {
      if (verbose) {
        console.log(message);
      }
      var regexp = new RegExp(pattern, "g"),
          match,
          requests = [],
          def;
      var msgs = [];
      while (match = regexp.exec(message.text)) {
        var theMatch = match[1].trim();
        if (theMatch != self.config.helpName) {
          var expansions = self.config.alias_maps[theMatch];
          if (verbose) {
            console.log("Match: ");
            console.log(match);
            console.log(expansions);
          }
          msgs.push(expansions.join(self.config.link_separator))
        } else {
          msgs.push(helpTxt);

        }
      }
      if (msgs.length > 0){
        self.slacker.send('chat.postMessage', {
            channel: message.channel,
            parse: "all",
            text: msgs.join(self.config.link_separator) + " ^",
            username: self.config.bot_name,
            unfurl_links: false,
            link_names: 1,
            icon_emoji: self.config.emoji
          });
      }

    }
    cb();
  });
  bot.connect();
};

exports = module.exports.Bot = Bot;
