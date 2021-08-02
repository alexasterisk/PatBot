const users = require("./users.json");
const lastMessageTime = {};

require('dotenv').config();
const petpet = require("pet-pet-gif");
const {Client, MessageAttachment} = require("discord.js");

var client = new Client({ws: {intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS']}});

client.once("ready", async () => {
    for (const userId of users) {
        lastMessageTime[userId] = Date.now();
    };

    client.user.setPresence({
        activity: {
            name: "god is dead and i killed him",
            type: "LISTENING"
        },
        status: "idle"
    });
});

client.on("presenceUpdate", async (oldMember, newMember) => {
    if (newMember.user.bot) return;
    var channel = await client.channels.fetch("870918853402701858");
    var userId = newMember.member.id;
    if (users.indexOf(userId) >= 0 && newMember.status === "online" && (oldMember && oldMember.status === "offline" || true)) {
        if (newMember.status === "online" && (oldMember && oldMember.status === "offline" || true)) {
            var animatedGif = await petpet(newMember.user.displayAvatarURL({"format": "png"}));
            var attachment = new MessageAttachment(animatedGif, "patpat.gif");
            attachment.height = 32;
            attachment.width = 32;
            channel.send(`Welcome back <@${userId}>!\nYou were last online <t:${lastMessageTime[userId].toString().slice(0, -3)}:R>.`, {
                files: [attachment]
            }).then(msg => msg.delete({timeout: 20000}));
            lastMessageTime[userId] = Date.now();
        } else if ((newMember.status === "idle" || newMember.status === "offline") && (oldMember && oldMember.status === "online" || true)) {
            lastMessageTime[userId] = Date.now();
        };
    };
});

client.login(process.env.token);