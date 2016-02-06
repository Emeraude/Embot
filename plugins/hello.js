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
