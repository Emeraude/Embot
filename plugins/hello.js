exports.version = "1.0.0";
exports.description = "";

exports.start = function() {
  console.log('started');
};

exports.stop = function() {
  console.log('stop it !');
};

exports.onJoin = function(chan, nick) {
  console.log('Hi on ' + chan + ', ' + nick + '!');
};

exports.onMessage = function(from, chan, msg) {
  console.log(from + ' => ' + chan + ': ' + msg);
}

exports.onEmitMessage = function(chan, msg) {
  console.log('=> ' + chan + ': ' + msg);
}
