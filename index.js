#!/usr/bin/env node

var irc = require('irc');
var PluginManager = require('./pluginManager');
var bot = new irc.Client('irc.freenode.net', 'embot', {userName: 'embot',
						       realName: 'embot',
						       secure: true,
						       port: 6697,
						       autoRejoin: true});

var admins = {emeraude: true}; // TODO: manage login name
Bot = {
  say: function(chan, msg) {
    bot.say(chan, msg);
  },

  isAdmin: function(user) {
    if (admins[user.toLowerCase()] === true)
      return true;
    return false;
  }
};

var plugin = new PluginManager();

bot.addListener('join', plugin.event('onJoin'));
bot.addListener('selfMessage', plugin.event('onEmitMessage'));

bot.addListener('message', function(from, chan, msg) {
  plugin.event('onMessage').apply(undefined, arguments);
  if (Bot.isAdmin(from)) {
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
  bot.join('#4242', function() {
    console.log('joined !');
  });
});
