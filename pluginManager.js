var _ = require('lodash');

module.exports = function() {
  var plugins = {};

  this.load = function(name) {
    plugins[name] = require('./plugins/' + name);
    plugins[name].start();
  };

  this.unload = function (name) {
    plugins[name].stop();
    delete require.cache[require.resolve('./plugins/' + name)];
    delete plugins[name];
  };

  this.unloadAll = function() {
    for (name in plugins) {
      this.unload(name);
    }
  };

  this.start = function(args, chan) {
    if (args.length == 0) {
      Bot.say(chan, 'Usage: !plugin start <name>');
    }
    else {
      this.load(args[0]);
      if (plugins[args[0]].version)
	Bot.say(chan, 'Plugin ' + args[0] + '@' + plugins[args[0]].version + ' started');
      else
	Bot.say(chan, 'Plugin ' + args[0] + ' started');
    }
  };

  this.restart = function(args, chan) {
    if (args.length == 0) {
      Bot.say(chan, 'Usage: !plugin restart <name>');
    }
    else {
      this.unload(args[0]);
      this.load(args[0]);
      if (plugins[args[0]].version)
	Bot.say(chan, 'Plugin ' + args[0] + '@' + plugins[args[0]].version + ' restarted');
      else
	Bot.say(chan, 'Plugin ' + args[0] + ' restarted');
    }
  };

  this.stop = function(args, chan) {
    if (args.length == 0) {
      Bot.say(chan, 'Usage: !plugin stop <name>');
    }
    else {
      this.unload(args[0]);
      Bot.say(chan, 'Plugin ' + args[0] + ' stopped');
    }
  };

  this.info = function(args, chan) {
    if (args.length == 0) {
      Bot.say(chan, 'Usage: !plugin info <name>');
    }
    else {
      var msg = 'Plugin ' + args[0];
      if (plugins[args[0]].version) {
	msg += '@' + plugins[args[0]].version
      }
      if (plugins[args[0]].description) {
	msg += ': ' + plugins[args[0]].description.replace(/\n/g, ' ');
      }
      Bot.say(chan, msg);
    }
  };

  this.list = function(args, chan) {
    if (_.size(plugins) == 0)
      Bot.say(chan, 'No plugin loaded');
    else
      Bot.say(chan, 'Loaded plugins: ' + _.keys(plugins).join(' '));
  };

  this.usage = function(args, chan) {
    Bot.say(chan, 'Usage: !plugin info | list | restart | start | stop');
  };

  this.event = function(func) {
    return function() {
      for (i in plugins) {
	if (typeof plugins[i][func] == 'function') {
	  plugins[i][func].apply(undefined, arguments);
	}
      }
    };
  }
};
