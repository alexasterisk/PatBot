const users = require("./users.json");
const lastMessageTime = {};

require('dotenv').config();
const chalk = require("chalk");
const petpet = require("pet-pet-gif");
const {Client, MessageAttachment} = require("discord.js");

var client = new Client();

client.once("ready", async () => {
    console.log(`${chalk.bgRed('ON')} PatBot has started!`);
    console.log(`${chalk.bold('Current Epoch:')} ${chalk.yellow(Date.now().toString())}`);
    for (const userId of users) {
        console.log(`${chalk.bgGreen('SET')} Setting User ${chalk.green(userId)} @ ${chalk.yellow(Date.now().toString())}`);
        lastMessageTime[userId] = Date.now();
    };

    client.user.setPresence({
        activity: {
            name: "god is dead and i killed him",
            type: "LISTENING"
        },
        status: "idle"
    });

    console.log(`${chalk.bgMagenta('STATUS')} Set status! We're good to go!`);
});

client.on("message", async (message) => {
    var userId = message.author.id;
    if (users.indexOf(userId) >= 0) {
        console.log(`Difference in time for ${message.author.username} is ${chalk.yellow((Date.now() - lastMessageTime[userId]).toString())}`);

        if (Date.now() - lastMessageTime[userId] >= 3600000) {
            console.log(`${chalk.bgGreen('PREV')} It has been longer than an hour since ${message.author.username} has sent a message!`);
            let animatedGif = await petpet(message.author.displayAvatarURL({"format": "png"}));

            message.channel.send(`Welcome back <@${userId}>!\nYou were last online <t:${lastMessageTime[userId].toString().slice(0, -3)}:R>.`, {
                files: [new MessageAttachment(animatedGif, "patpat.gif")]
            });
        };
        lastMessageTime[userId] = Date.now();
    };
});

client.login(process.env.token);