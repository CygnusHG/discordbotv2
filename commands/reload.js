exports.run = (client, message, args, tools, ops) => {
    
    if (message.author.id !== ops.ownerID) return message.channel.send('Ne pare rau dar nu aveti permisiune sa folositi aceasta comanda.');
    
    try {
        delete require.cache[require.resolve(`./${args[0]}.js`)];
    } catch (e) {
        return message.channel.send(`Unable to reload: ${args[0]}`);
    }

    message.channel.send(`Succesfully reloaded: ${args[0]}`);

}