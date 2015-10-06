# Slack Alias Plugin

A Slack plugin for expanding aliases to actual people  

It does the following:

1. Anytime an @ mention of a key in the alias_maps is used, it will expand that to post the values into the window

## Usage

```javascript
git clone https://github.com/gsingers/slack-alias-plugin.git
cd slack-alias-plugin
npm install
```

Write your own configuration file (`config-example.js`) is a good starting point for building your own.

```javascript
var slackbot = require('./lib/bot');

var config = {
    bot_name: "",//Provide the name to post under
    token: 'XXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXX',
    alias_maps: {
      "BAR": ["cool", "aliases"],
      "FOO": ["bar"],
    },

    helpName: "ALIASHELP",
    verbose: true,
    emoji: ":slack:",
    link_separator: ", "// use \n if you want new lines
};

//DO NOT EDIT BELOW HERE
var slackbot = new slackbot.Bot(config);
slackbot.run();

```

Save this to a file in the root of the project then run your bot with:

    node your-config-file, eg.: node config-gsingers

This will launch the bot in your terminal based on provided configuration.

## Configuration

- `token`: Your Slack API token, get your token at https://api.slack.com/
- `alias_maps`: The mappings between alias names and values.  For instance, a mention of @FOO will expand to @bar in the channel
- `verbose`: print logging info
- `emoji`: The emoji to use for the bot.  You may need to create a JIRA emoji for the current one to work, else replace w/ your favorite slack emoji
- `link_separator`: The text to use to separate links in the response.

## TODO:

- Make the lists updateable in slack
