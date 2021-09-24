let debugTime = Date.now();

const config = require("./config.json");
const lastMessageTime = {};

require('dotenv').config();
const chalk = require("chalk");
const petpet = require("pet-pet-gif");
const {Client, MessageAttachment, Intents} = require("discord.js");
console.log(`Got request to start @ ${chalk.yellow(debugTime)}`);
console.log(`Got all dependencies in ${chalk.yellow(Date.now() - debugTime)}ms`);
debugTime = Date.now();

const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS ] })

client.once("ready", async () => {
    console.log(`\n--- Beginning ready state @ ${chalk.yellow(Date.now())} ${chalk.gray(`[Elapsed ${chalk.bgYellow(Date.now() - debugTime)}ms]`)} ---`);
    debugTime = Date.now();
    if (!config.allUsers) {
        for (const userId of config.users) {
            lastMessageTime[userId] = Date.now();
            console.log(`* Defined ${chalk.green(userId)} in ${Date.now() - debugTime}ms`);
            debugTime = Date.now();
        };
    };

    console.log(`\nSetting presence @ ${chalk.yellow(Date.now())} ${chalk.gray(`[Elapsed ${chalk.bgYellow(Date.now() - debugTime)}ms]`)}`);
    debugTime = Date.now();
    client.user.setPresence({
        activity: {
            name: "god is dead and i killed him",
            type: "LISTENING"
        },
        status: "idle"
    });

    console.log(`--- Finished ready state in ${chalk.yellow(Date.now() - debugTime)}ms ---`);
    debugTime = Date.now();
});


client.on("presenceUpdate", async (oldMember, newMember) => {
    console.log(`--- Got presenceUpdate request from ${chalk.green(newMember.user.id)} ---`);
    if (newMember.user.bot) return;
    const channel = await client.channels.fetch(config.channel);
    const userId = newMember.member.id;
    if (config.allUsers || config.users.indexOf(userId) >= 0) {
        console.log(`* ${chalk.green(newMember.user.id)} is in ${chalk.gray('config.json#users')}`);
        if (newMember.status === "online" && (oldMember?.status != 'online')) {
            console.log(`* ${chalk.green(newMember.user.id)} has gone online!`);
            const animatedGif = await petpet(newMember.user.displayAvatarURL({"format": "png"}));
            let attachment = new MessageAttachment(animatedGif, "patpat.gif");
            attachment.height = 128;
            attachment.width = 128;
            await channel.send({
                content: `Welcome back ${newMember.user}!\nYou were last online <t:${lastMessageTime[userId].toString().slice(0, -3)}:R>`,
                files: [attachment]
            }).then(async msg => {
                await new Promise(r => setTimeout(r, 20000))
                try {msg.delete()} catch {}
            });
            lastMessageTime[userId] = Date.now();
        } else if (newMember?.status === "idle" || newMember?.status === 'offline') {
            console.log(`* ${chalk.green(newMember.user.id)} has gone inactive/offline!`);
            lastMessageTime[userId] = Date.now();
        };
    };
});

client.login(process.env.token);
console.log(`Logged in! Took ${chalk.yellow(Date.now() - debugTime)}ms`);
debugTime = Date.now();