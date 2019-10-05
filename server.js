const Discord = require('discord.js');
const tools = require('./functions.js');
const client = new Discord.Client();

const prefix = '!';
const ownerID = '317620976688955392';

const db = require('quick.db');

client.on('message', async message => {
    if (message.author.bot) return;

    if (message.channel.type !== 'text') {

        let active = await db.get(`support_${message.author.id}`);

        let guild = client.guilds.get('593548352373915679');

        let channel, found = true;

        try {
            if (active) client.channels.get(active.channelID)
        } catch (e) {
            found = false;
        }

        if (!active || !found) {

            active = {};
            
            channel = await guild.channels.create(`${message.author.username}-${message.author.discriminator}`, {
                parent: '596017375560728616',
                topic: `!complete to close the ticket | Support for ${message.author.tag} | ID: ${message.author.id}`
            });

            let author = message.author;

            
            const newChannel = new Discord.MessageEmbed()
                .setColor(0x36393e)
                .setAuthor(author.tag, author.displayAvatarURL())
                .setFooter('Support Ticket Created')
                .addField('User', author)
                .addField('ID', author.id)
 
            await channel.send(newChannel);
 
            const newTicket = new Discord.MessageEmbed()
                .setColor(0x36393e)
                .setAuthor(`Hello ${author.tag}`, author.displayAvatarURL())
                .setFooter('Support Ticket Created')
 
            await author.send(newTicket);
 
            active.channelID = channel.id;
            active.targetID = author.tag;
        }
 
        channel = client.channels.get(active.channelID);
 
        const dm = new Discord.MessageEmbed()
        .setColor(0x36393e)
        .setAuthor(`Thank you, ${message.author.tag}`, message.author.displayAvatarURL())
        .setFooter(`Your message has been sent -- A staff member will be in contact soon`)
 
        await message.author.send(dm);
 
        const embed = new Discord.MessageEmbed()
            .setColor(0x36393)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(message.content)
            .setFooter(`Message Recieved -- ${message.author.tag}`)
 
        await message.author.send(embed);
 
        db.set(`support_${message.author.id}`, active);
        db.set(`supportChannel_${channel.id}`, message.author.id);
        return;
    }
 
    let support = await db.get(`supportChannel_${message.channel.id}`);
 
    if (support) {
 
        support = await db.get(`support_${support}`);
 
        let supportUser = client.users.get(support.targetID);
        if (!supportUser) return message.channel.delete();
 
        if (message.content.toLowerCase() === '!complete') {
            const complete = new Discord.MessageEmbed()
                .setColor(0x39363e)
                .setAuthor(`Hey ${supportUser.tag}`, supportUser.displayAvatarURL())
                .setFooter('Ticket Closed -- test server')
                .setDescription('*Your ticket has been marked as **complete**. If you wish to reopen this, or create a new one, please send a message to the bot.*')
   
            supportUser.send(complete);
 
            message.channel.delete();
 
            db.delete(`support_${support,targetID}`);
        }

        const embed = new Discord.RichEmbed()
            .setColor(0x36393e)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setFooter(`Message Recieved -- test server`)
            .setDescription(message.content)

        client.users.get(support.targetID).send(embed)

        message.delete({timeout: 1000});

        embed.setFooter(`Message Sent -- ${supportUser.tag}`).setDescription(message.content);

        return message.channel.send(embed);

    }

    let args = message.content.slice(prefix.length).trim().split(' ');
    let cmd = args.shift().toLowerCase();

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    try {

        delete require.cache[require.resolve(`./commands/${cmd}.js`)];

        let ops = {
            ownerID: ownerID
        }

        let commandFile = require(`./commands/${cmd}.js`);
        commandFile.run(client, message, args, tools, ops);
    } catch (e) {
        console.log(e.stack);
    }

});

client.on('ready', () => console.log('Bot Launched!'));

client.login('insert token here');
