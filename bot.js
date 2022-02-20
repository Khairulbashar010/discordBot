require('dotenv').config();
const lib = require('./lib');
const { Client, Intents, RichEmbed } = require('discord.js');
const PREFIX = "!join-";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.on('ready', () => {
    console.log(`[${client.user.tag}] has loged in`)
})

client.on('messageCreate', async(message) => {
    if(message.author.bot) return;
    if(message.content.startsWith(PREFIX)){
        var clan = message.content.substring(PREFIX.length).split(" ")[0];
        if(clan.length > 0){
            var validateCommand = await lib.commandValidation(clan);
        }
        message.reply(validateCommand.message);
        if(validateCommand.success){
            let firstMessage = await message.author.send("Please provide your email id");
            let filter = () => true; // you don't need it, since it's a DM.
            let collected = await firstMessage.channel.awaitMessages(filter, {
                maxMatches: 1, // you only need one message
                time: 10000 // the time you want it to run for
                }).catch(console.log);

            if (collected && collected.size > 0) {
                let email = collected.first().content.split(' ')[0]; // grab the email
                collected.forEach(msg => msg.delete()); // delete every collected message (and so the email)
                await firstMessage.edit("Email saved!"); // edit the first message you sent
            } else await firstMessage.edit("Command timed out :("); // no message has been received

            firstMessage.delete(30000); // delete it after 30 seconds
        }

    }
})

client.login(process.env.BOT_TOKEN);