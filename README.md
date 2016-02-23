# Embot

A plugin based IRC bot, written in node.js.  
An example plugin is located in file *plugins/hello.js*

## Installation

```bash
npm install
mv config.json.default config.json
npm start
```

## Commands

If you are in the list of the bot administrators, you can manage the bot at the runtime, via some commands in the chans where the bot is (or via private message).

### Builtin commands

- `!join <chan>...` Join the given channels
- `!quit` Quit the client, exiting all the plugins properly and disconnecting from the server

### Managing the plugins

The plugins are in directory **plugins** and are loaded at the bot launch depending on the configuration file, but you can manage them at the runtime:

- `!plugin` List the available commands
- `!plugin info <name>` Retrieve version and description from plugin
- `!plugin list` List available plugins
- `!plugin restart <name>` Restart the plugin
- `!plugin start <name>` Start the plugin
- `!plugin stop <name>` Stop the plugin

Note that the `start` and `restart` plugin will not use the cache of `require` function, so you can rewrite some part of your plugin and reload it at the runtime.

## Writing your own plugins

Plugins must be in directory **plugins** and will be loaded using `require('./plugins/' + name)`, so it could be a single js file or a directory.  
You can define several functions:

```javascript
exports.start(); // Function called when the plugin is started or restarted
exports.stop(); // Function called when the plugin is stopped or restarted
exports.onJoin(chan, nick); // Called when somebody (including the bot) joins the channel
exports.onMessage(from, chan, msg); // Called when somebody send a message to a channel, or to an user (excluding the bot)
exports.onEmitMessage(chan, msg); // Called when the bot send a message to a channel, or to an user
exports.onPart(chan, nick, reason); // Called when somebody parts a channel
exports.onQuit(nick, reason, chans); // Called when somebody quit the server. chans is the list of channels the user was.
exports.onNotice(from, chan, msg); // Called when somebody send a notice to a channel, or to an user
exports.onAction(from, chan, msg); // Called when somebody do a /me
```

### Attributes

You can also set some informations, as the version number of the plugin, or its description.

```javascript
exports.version = "1.0.0";
exports.description = "My awesome plugin !"
```

### Bot object

In all the function you write for your plugin, the **Bot** global object will be available, defined as below:

#### Bot.nick

A getter for the current nick of the bot (could be different from the nick given in configuration).

#### Bot.say(channel, message)

Send a `message` to the given `channel`. Note that `channel` could also be a user.

#### Bot.isAdmin(user)

Return **true** if the user is a registered administrator of the bot, or **false** otherwise. Note that it's using the nick name and not the login name. It will be changed in the future.
