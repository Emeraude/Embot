#!/usr/bin/env node

var _ = require('lodash');
var irc = require('irc');
var PluginManager = require('./pluginManager');
var bot = new irc.Client('irc.freenode.net', 'embot', {userName: 'embot',
						       realName: 'embot',
						       secure: true,
						       port: 6697,
						       autoRejoin: true});

var admins = {emeraude: true}; // TODO: manage login name
var plugin = new PluginManager(bot, admins);
Bot = {
  say: function(chan, msg) {
    bot.say(chan, msg);
  },

  isAdmin: function(user) {
    if (admins[user] === true)
      return true;
    return false;
  }
};

// bot.addListener('join', function(chan, nick) {
//   for (i in plugins) {
//     if (typeof plugins[i].onJoin == 'function') {
//       plugins[i].onJoin(chan, nick);
//     }
//   }
// });

// bot.addListener('selfMessage', function(chan, nick) {
//   for (i in plugins) {
//     if (typeof plugins[i].onEmitMessage == 'function') {
//       plugins[i].onEmitMessage(chan, nick);
//     }
//   }
// });

bot.addListener('message', function(from, chan, msg) {
  // for (i in plugins) {
  //   if (typeof plugins[i].onMessage == 'function') {
  //     plugins[i].onMessage(from, chan, msg);
  //   }
  // }
  if (admins[from.toLowerCase()] === true) {
    if (msg.match(/^!quit.*$/)) {
      plugin.unloadAll();
      bot.disconnect('bye');
      process.exit();
    }
    if (msg.match(/^!join.*$/)) {
      var args = msg.split(/[\t ]+/);
      if (args.length > 1) {
	for (var i = 1; args[i]; ++i)
	  bot.join(args[i]); // TODO: wrap it
      }
      else {
	bot.say(chan, 'Usage: !join <chan>...'); // TODO: wrap it
      }
    }
    else if (msg.match(/^!plugin.*$/)) {
      var args = msg.split(/[\t ]+/);
      if (args.length > 1) {
	// This is slow, need refacto
	var cmds = ['start', 'stop', 'list', 'version']
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
