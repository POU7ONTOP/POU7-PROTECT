const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'unbl',
    aliases: ['unblacklist'],
    run: async (client, message, args, prefix, color) => {
        // Vérifie si l'expéditeur de la commande est un propriétaire
        if (!client.config.owner.includes(message.author.id) && db.get(`ownermd_${client.user.id}_${message.author.id}`) !== true) {
            return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
        }

        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) {
            return message.reply('Veuillez mentionner un utilisateur ou fournir son ID à retirer de la liste noire globale.');
        }

        let blacklistedUsers = db.get('blacklistedUsers') || [];

        if (!blacklistedUsers.includes(user.id)) {
            return message.reply(`${user.tag} n'est pas blacklisté.`);
        }

        // Retire l'utilisateur de la blacklist
        blacklistedUsers = blacklistedUsers.filter(id => id !== user.id);
        db.set('blacklistedUsers', blacklistedUsers);

        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`**${user.tag}** a été retiré de la liste noire globale.`);
        message.channel.send(embed);

        // Note Importante : Cette commande retire uniquement l'utilisateur de la base de données de la *blacklist*.
        // En raison de la logique de re-bannissement automatique dans index.js (événement guildBanRemove),
        // si cet utilisateur est actuellement banni sur un serveur, il restera banni
        // jusqu'à ce qu'il soit débanni manuellement, et alors il ne sera *pas* re-banni.
        // Si tu voulais qu'il soit dé-banni en masse, il faudrait un système plus complexe.
    }
};
