const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'unblrank',
    aliases: ['unblacklistrank'],
    run: async (client, message, args, prefix, color) => {
        // Vérifie si l'expéditeur de la commande est un propriétaire
        if (!client.config.owner.includes(message.author.id) && db.get(`ownermd_${client.user.id}_${message.author.id}`) !== true) {
            return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
        }

        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) {
            return message.reply('Veuillez mentionner un utilisateur ou fournir son ID à retirer de la blacklist de rang.');
        }

        if (db.get(`blrankmd_${client.user.id}_${user.id}`) === null) {
            return message.channel.send(`${user.tag} n'est pas dans la Blacklist Rank`);
        }

        // Supprime l'entrée de la base de données
        db.delete(`blrankmd_${client.user.id}_${user.id}`);

        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`**${user.tag}** a été retiré de la Blacklist Rank.`);
        message.channel.send(embed);
    }
};
