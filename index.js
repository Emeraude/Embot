#!/usr/bin/env node

var _ = require('lodash');
var irc = require('irc');
var bot = new irc.Client('irc.freenode.net', 'embot', {userName: 'embot',
						       realName: 'embot',
						       secure: true,
						       port: 6697,
						       autoRejoin: true});

var admins = {emeraude: true}; // TODO: manage login name
var plugins = {};
Bot = {
  say: function(chan, msg) {
    bot.say(chan, msg);
  }
};

function loadPlugin(name) {
  plugins[name] = require('./plugins/' + name);
  plugins[name].start();
}

function unloadPlugin(name) {
  plugins[name].stop();
  delete require.cache[require.resolve('./plugins/' + name)];
  delete plugins[name];
}

bot.addListener('join', function(chan, nick) {
  for (i in plugins) {
    if (typeof plugins[i].onJoin == 'function') {
      plugins[i].onJoin(chan, nick);
    }
  }
});

bot.addListener('selfMessage', function(chan, nick) {
  for (i in plugins) {
    if (typeof plugins[i].onEmitMessage == 'function') {
      plugins[i].onEmitMessage(chan, nick);
    }
  }
});

bot.addListener('message', function(from, chan, msg) {
  for (i in plugins) {
    if (typeof plugins[i].onMessage == 'function') {
      plugins[i].onMessage(from, chan, msg);
    }
  }
  if (admins[from.toLowerCase()] === true) {
    if (msg.match(/^!quit.*$/)) {
      for (i in plugins) {
	unloadPlugin(plugins[i]);
      }
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
	if (args[1] == 'stop') {
	  if (args.length == 2) {
	    bot.say(chan, 'Usage: !plugin stop <name>'); // TODO: wrap it
	  }
	  else {
	    unloadPlugin(args[2]);
	  }
	}
	else if (args[1] == 'list') {
	  if (_.size(plugins) == 0)
	    bot.say(chan, 'No plugin loaded'); // TODO: wrap it
	  else
	    bot.say(chan, 'Loaded plugins: ' + _.keys(plugins).join(' ')); // TODO: wrap it
	}
	else if (args[1] == 'start') {
	  if (args.length == 2) {
	    bot.say(chan, 'Usage: !plugin start <name>'); // TODO: wrap it
	  }
	  else {
	    loadPlugin(args[2]);
	  }
	}
      }
      else {
	bot.say(chan, 'Usage: !plugin stop | start | list'); // TODO: wrap it
      }
    }
  }
});

bot.addListener('error', function(msg) {
  console.error(msg);
});

bot.addListener('registered', function() {
  console.log('connected');
  loadPlugin('hello');
  bot.join('#4242', function() {
    console.log('joined !');
  });
});
