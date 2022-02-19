require('dotenv').config();
const lib = require('./lib');
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.on('ready', () => {
    console.log(`[${client.user.tag}] has loged in`)
})

client.on('messageCreate', async(message) => {
    var processedMessage = await lib.checkMessage(message);
    console.log(processedMessage)
})

client.login(process.env.BOT_TOKEN);