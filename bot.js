var irc = require("irc");
var channels = require("./channels");

var kNick = 'afrosdwilsh';
var kAuthorizedUsers = [
  'sdwilsh', 'robarnold'
];

var client = new irc.Client("irc.mozilla.org", kNick, {
  debug: true,
  userName: kNick,
  realName: "Permasheriff Extraordinaire",
  channels: [],
  secure: true,
  port: 6697
});

client.on("invite", function (channel, from) {
  if (kAuthorizedUsers.indexOf(from) !== -1) {
    // TODO: solve race condition here
    client.join(channel, function () {
      channels.add(channel, client.say.bind(client, channel));
    });
  }
});
client.addListener("error", function(m) {
  console.error(m);
});
client.addListener("message", function(from, to, message) {
  var channel = channels.get(to);

  if (channel === undefined)
    return;

  var match = /(.+): (.*)/.exec(message);
  if (match) {
    target = match[1];
    text = match[2];

    if (target === kNick) {
      channel.handleCommand(from, text);
    }
  }
});
