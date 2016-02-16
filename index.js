#!/usr/bin/env node

var irc = require('irc');
var PluginManager = require('./pluginManager');
var config = require('./config.json');
var bot = new irc.Client(config.server, config.name, {userName: config.name,
						      realName: config.name,
						      secure: config.ssl ? true : false,
						      port: config.port,
						      autoRejoin: true});

if (!config.admins)
  config.admins = {};

// TODO : create a real object
Bot = {
  say: function(chan, msg) {
    bot.say(chan, msg);
  },

  isAdmin: function(user) { // TODO: manage login name
    if (config.admins[user.toLowerCase()] === true)
      return true;
    return false;
  },
};

var plugin = new PluginManager();

bot.addListener('join', plugin.event('onJoin'));
bot.addListener('selfMessage', plugin.event('onEmitMessage'));
bot.addListener('part', plugin.event('onPart'));
bot.addListener('quit', plugin.event('onQuit'));
bot.addListener('notice', plugin.event('onNotice'));
bot.addListener('action', plugin.event('onAction'));

bot.addListener('message', function(from, chan, msg) {
  plugin.event('onMessage').apply(undefined, arguments);
  if (Bot.isAdmin(from)) {
    if (chan == Bot.nick) {
      chan = from;
    }
    if (msg.match(/^!quit.*$/)) {
      plugin.unloadAll();
      bot.disconnect('bye');
      process.exit();
    }
    if (msg.match(/^!join.*$/)) {
      var args = msg.split(/[\t ]+/);
      if (args.length > 1) {
	for (var i = 1; args[i]; ++i)
	  bot.join(args[i]);
      }
      else {
	bot.say(chan, 'Usage: !join <chan>...');
      }
    }
    else if (msg.match(/^!plugin.*$/)) {
      var args = msg.split(/[\t ]+/);
      if (args.length > 1) {
	// This is slow, need refacto
	var cmds = ['start', 'restart', 'stop', 'list', 'info']
	for (var i = 0; i < cmds.length; ++i) {
	  if (args[1] == cmds[i])
	    plugin[cmds[i]](args.splice(2), chan);
	}
      }
      else {
	plugin.usage(null, chan);
      }
    }
  }
});

bot.addListener('error', function(msg) {
  console.error(msg);
});

bot.addListener('registered', function() {
  console.log('connected');
  plugin.load('hello');
  Bot.nick = bot.nick // TODO : manage update of it
  for (i in config.channels) {
    bot.join(config.channels[i], function() {
      console.log('joined !');
    });
  }
});
