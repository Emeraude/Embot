exports.version = "1.0.0";
exports.description = "Test plugin";

exports.start = function() {
  console.log('started');
};

exports.stop = function() {
  console.log('stop it !');
};

exports.onJoin = function(chan, nick) {
  console.log('Hi on ' + chan + ', ' + nick + '!');
  Bot.say(chan, 'Hi on ' + chan + ', ' + nick + '!');
};

exports.onMessage = function(from, chan, msg) {
  console.log(from + ' => ' + chan + ': ' + msg);
}

exports.onEmitMessage = function(chan, msg) {
  console.log('=> ' + chan + ': ' + msg);
}

exports.onPart = function(chan, nick, msg) {
  console.log(nick + ' has parted ' + chan + ' (' + msg + ')');
}

exports.onQuit = function(nick, msg, chans) {
  console.log(nick + 'has quit (' + msg + ')');
}

exports.onNotice = function(from, chan, msg) {
  console.log(from + ' => ' + chan + ' (notice): ' + msg);
}

exports.onAction = function(from, chan, msg) {
  console.log('(' + chan + ') ' + from + ' ' + msg);
}
