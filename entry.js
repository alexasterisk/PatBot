const users = require('./userEmojis.json');
const lastMessageTime = {};

require('dotenv').config();
const {Client} = require("discord.js");
var client = new Client();

client.once('ready', () => {
    for (const [uid, _] of Object.entries(users)) {
        lastMessageTime[uid] = Date.now();
    };

    client.user.setPresence({
        activity: {
            name: "god is dead and i killed him",
            type: "LISTENING"
        },
        status: "idle"
    });
});

client.on("message", message => {
    var uid = message.author.id;
    if (users[uid]) {
        if (Date.now() - lastMessageTime[uid] >= 3600000) {
            message.channel.send(`Welcome back <@${uid}>! <a:${users[uid]}>\nYou were last online <t:${lastMessageTime[uid].toString().slice(0, -3)}:R>!`);
        };
        lastMessageTime[uid] = Date.now();
    };
});

client.login(process.env.token);