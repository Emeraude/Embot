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
    }
  };

  this.stop = function(args, chan) {
    if (args.length == 0) {
      Bot.say(chan, 'Usage: !plugin stop <name>');
    }
    else {
      this.unload(args[0]);
    }
  };

  this.version = function(args, chan) {
    if (args.length == 0) {
      Bot.say(chan, 'Usage: !plugin version <name>');
    }
    else if (plugins[args[0]].version) {
      Bot.say(chan, plugins[args[0]].version);
    } else {
      Bot.say(chan, 'No version information provided for plugin `' + args[0] + '`');
    }
  };

  this.list = function(args, chan) {
    if (_.size(plugins) == 0)
      Bot.say(chan, 'No plugin loaded');
    else
      Bot.say(chan, 'Loaded plugins: ' + _.keys(plugins).join(' '));
  };

  this.usage = function(args, chan) {
    Bot.say(chan, 'Usage: !plugin stop | start | list | version');
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
