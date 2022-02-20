require('dotenv').config();
const lib = require('./lib');
const { Client, Intents } = require('discord.js');
const PREFIX = process.env.PREFIX;
const BOTCHANNEL = process.env.BOTCHANNEL;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, "GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
    partials: ['CHANNEL']
});

client.on('ready', () => {
    console.log(`[${client.user.tag}] has loged in`)
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;                                             // skip bot messages
    if(message.guildId){                                                        // message from a channel
        var botChannel = message.channel.guild.channels.cache.find((channel) => channel.name.toLowerCase() === BOTCHANNEL);    // general channel
    }
    // invoke bot with '!join-' in defined channel
    if (message.content.startsWith(PREFIX)) {
        if(!message.guildId || message.channelId != botChannel.id) return;      // DM or not the bot channel
        var clan = message.content.substring(PREFIX.length).split(" ")[0];
        if (clan.length > 0) {
            var validateCommand = await lib.commandValidation(clan);            //validate the given command
        }
        message.channel.send(`${message.author}, ${validateCommand.message}`);  // response after validation
        if (validateCommand.success) {
            // Direct Messages
            const firstMessage = await message.author.send("Please provide your email id");
            const filter = () => true;      // no filter needed
            const collector = firstMessage.channel.createMessageCollector({
                filter,
                maxProcessed: 1,            // need one message
                time: 60 * 5 * 1000,        // the time to wait for
                errors: ['time']
            })
            collector.on("collect", async (dmMessage) => {        // on receiving a message
                let userObj = {
                    Email: dmMessage.content,
                    commandData: validateCommand.commandData
                }
                var validateUser = await lib.userValidation(userObj); // validate given email
                if (validateUser.success) {
                    const guild = client.guilds.cache.get(message.guildId);     // as no guildId present in DM message
                    const role = guild.roles.cache.get(userObj.commandData.RoleId);
                    var isMember = guild.members.cache.get(message.author.id);  // to check if user still in server
                    if (isMember) {
                        if (isMember.roles.cache.some(roles => roles.id === role.id)) { // check if already has role
                            await isMember.send("Already in the clan.");
                        } else {
                            await isMember.roles.add(role);     // add the role
                            await client.channels.cache.get(userObj.commandData.ChannelId).send(`Welcome to the clan, ${isMember}`);        // welcome message
                        }
                    }
                } else {
                    await message.author.send(validateUser.message);    // couldn't validate email
                }
                collector.stop("collected");
            })
            collector.on('end', async (collected, reason) => reason == 'time' ? await message.author.send("Timeout :(\nPlease retry"): console.log(reason));        // timeout message
        }

    }
})

client.login(process.env.BOT_TOKEN);