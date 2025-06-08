const Discord = require('discord.js')
const db = require('quick.db')
const {
	MessageActionRow,
	MessageButton,
	MessageMenuOption,
	MessageMenu
} = require('discord-buttons');
const {
	ButtonPages
} = require('../../util/embedButton/start.js');

module.exports = {
	name: 'help',
	aliases: [],
	run: async (client, message, args, prefix, color) => {
		if (args[0] === "all") {

			const public = new Discord.MessageEmbed()
				.setColor(color)
				.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
				.setTitle("Liste des commandes par permissions")
				.setTimestamp()
				.setDescription(`
**__Public__**
- \`${client.config.prefix}banner [membre]\`
- \`${client.config.prefix}invite [membre]\`
- \`${client.config.prefix}support\`
- \`${client.config.prefix}pic [membre]\`
- \`${client.config.prefix}snipe\`
- \`${client.config.prefix}ping\`
- \`${client.config.prefix}serverinfo [guild]\`
- \`${client.config.prefix}userinfo [user]\`
- \`${client.config.prefix}top [rank]\`
- \`${client.config.prefix}help\`
- \`${client.config.prefix}channelinfo [salon]\`
`)

			const mods = new Discord.MessageEmbed()
				.setColor(color)
				.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
				.setTitle("Liste des commandes par permissions")
				.setTimestamp()
				.setDescription(`
**__Modération__**
- \`${client.config.prefix}lock [channel]\`
- \`${client.config.prefix}unlock [channel]\`
- \`${client.config.prefix}derank [membre]\`
- \`${client.config.prefix}setvc [channel]\`
- \`${client.config.prefix}delvc\`
- \`${client.config.prefix}hide [channel]\`
- \`${client.config.prefix}unhide [channel]\`
- \`${client.config.prefix}kick <membre> [raison]\`
- \`${client.config.prefix}ban <membre> [raison]\`
- \`${client.config.prefix}unban <membreID>\`
- \`${client.config.prefix}nuke [channel]\`
- \`${client.config.prefix}warn <add/remove/list> <membre> [remove: warnID] [add: raison]\`
- \`${client.config.prefix}tempmute <membre> <temps>\`
- \`${client.config.prefix}tempban <membre> <temps>\`
- \`${client.config.prefix}unmute <membre>\`
- \`${client.config.prefix}antiwebhook <on/off>\`
- \`${client.config.prefix}slowmode <temps>\`
- \`${client.config.prefix}clear <nombre>\`
- \`${client.config.prefix}antiroles <on/off>\`
- \`${client.config.prefix}antichannel <on/off>\`
- \`${client.config.prefix}antibot <on/off>\`
- \`${client.config.prefix}antiban <on/off>\`
- \`${client.config.prefix}antimute <on/off>\`
- \`${client.config.prefix}antickick <on/off>\`
- \`${client.config.prefix}antiunban <on/off>\`
- \`${client.config.prefix}antispam <on/off> [nombre]`
			)
			const config = new Discord.MessageEmbed()
				.setColor(color)
				.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
				.setTitle("Liste des commandes par permissions")
				.setTimestamp()
				.setDescription(`
**__Configuration__**
- \`${client.config.prefix}maxwarn <nombre>\`
- \`${client.config.prefix}sanction <kick/ban>\`
- \`${client.config.prefix}setlogs <channel>\`
- \`${client.config.prefix}delogs\`
- \`${client.config.prefix}setrank <channel>\`
- \`${client.config.prefix}delrank\`
- \`${client.config.prefix}setlvl <channel>\`
- \`${client.config.prefix}dellvl\`
- \`${client.config.prefix}joinmessage <set/del> [message]\`
- \`${client.config.prefix}leavemessage <set/del> [message]\`
- \`${client.config.prefix}setcaptcha <on/off>\`
- \`${client.config.prefix}delcaptcha\`
- \`${client.config.prefix}setwelcomesala <channel>\`
- \`${client.config.prefix}delwelcomesala\`
- \`${client.config.prefix}ticket <on/off> [categorie]\`
- \`${client.config.prefix}setautorole <role>\`
- \`${client.config.prefix}delautorole\`
- \`${client.config.prefix}setvoc <channel>\`
- \`${client.config.prefix}delvoc\`
- \`${client.config.prefix}setmod <role>\`
- \`${client.config.prefix}delmod\`
- \`${client.config.prefix}setuplogs <channel>\`
- \`${client.config.prefix}deluplogs\`
`)
			let perm = ""
			if (client.config.owner.includes(message.author.id)) perm = 5;
			else if (db.get(`ownermd_${client.user.id}_${message.author.id}`) === true) perm = 4;
			else if (db.get(`mod_${message.guild.id}`) === true && db.get(`mod_${message.guild.id}_${message.author.id}`) === true) perm = 3;
			else if (db.get(`perm_${message.guild.id}_${message.author.id}`) === true) perm = 2;
			else if (db.get(`public_${message.guild.id}_${message.channel.id}`) === true) perm = 1;

			const util = new Discord.MessageEmbed()
				.setColor(color)
				.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
				.setTitle("Liste des commandes par permissions")
				.setTimestamp()
				.setDescription(`
**__Utilitaire__**
- \`${client.config.prefix}eval <code>\` (Propriétaire Seulement)
- \`${client.config.prefix}backup <create/load/list/delete> [ID]\` (Propriétaire Seulement)
- \`${client.config.prefix}bl <membre>\` (Propriétaire Seulement)
- \`${client.config.prefix}unbl <membre>\` (Propriétaire Seulement)
- \`${client.config.prefix}blrank <add/remove/list> <membre>\` (Propriétaire Seulement)
- \`${client.config.prefix}unblrank <membre>\` (Propriétaire Seulement)
- \`${client.config.prefix}botconfig\` (Propriétaire Seulement)
- \`${client.config.prefix}botinfo\` (Propriétaire Seulement)
- \`${client.config.prefix}owner <add/clear/list/remove> <add/remove: membre>\` (Propriétaire Seulement)
- \`${client.config.prefix}prefix <nouveau_prefix>\` (Propriétaire Seulement)
- \`${client.config.prefix}server <invite/leave/list> <leave/invite: ID>\` (Propriétaire Seulement)
`)

                // AJOUTE LES NOUVELLES COMMANDES DANS CE BLOC EXISTANT
			if (5 <= perm) {
                    // CONSERVE TES CHAMPS EXISTANTS QUI ÉTAIENT DANS L'EMBED 'bot' ou 'util'
				util.addField(`\`${prefix}botinfo\``, "Permet de voir les informations du bot");
				util.addField(`\`${prefix}whitelist <add/clear/list/remove> <add/remove: membre>\``, "Permet de gérer les utilisateurs whitelist");

                    // AJOUTE LES NOUVELLES COMMANDES ICI :
				util.addField(`\`${prefix}eval <code>\``, "Exécute du code JavaScript (Propriétaire Seulement)");
				util.addField(`\`${prefix}backup <create/load/list/delete> [ID]\``, "Gère les sauvegardes de serveur (Propriétaire Seulement)");
				util.addField(`\`${prefix}bl <membre>\``, "Blackliste un utilisateur globalement (Propriétaire Seulement)");
				util.addField(`\`${prefix}unbl <membre>\``, "Retire un utilisateur de la liste noire globale (Propriétaire Seulement)");
				util.addField(`\`${prefix}blrank <add/remove/list> <membre>\``, "Gère la blacklist de rang (Propriétaire Seulement)");
				util.addField(`\`${prefix}unblrank <membre>\``, "Retire un utilisateur de la blacklist de rang (Propriétaire Seulement)");
				util.addField(`\`${prefix}botconfig\``, "Configure le profil du bot (Propriétaire Seulement)");
				util.addField(`\`${prefix}owner <add/clear/list/remove> <add/remove: membre>\``, "Gère les propriétaires du bot (Propriétaire Seulement)");
				util.addField(`\`${prefix}prefix <nouveau_prefix>\``, "Définit le préfixe du bot (Propriétaire Seulement)");
				util.addField(`\`${prefix}server <invite/leave/list> <leave/invite: ID>\``, "Gère les serveurs du bot (Propriétaire Seulement)");
			}


			if (perm === "" && db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true) return message.channel.send(util)
			if (perm === 1) {
				const embedPages = [public, util, mods, config]; // Ajoute 'config' aux pages si c'est nouveau
				return ButtonPages(client.interaction, message, embedPages, 60 * 1000, "gray", "▶", "◀");
			} else if (perm === 2 || perm === 3) {
				const embedPages = [public, util, mods, config]; // Ajoute 'config'
				return ButtonPages(client.interaction, message, embedPages, 60 * 1000, "gray", "▶", "◀");
			} else if (perm === 4 || perm === 5) {
				const embedPages = [public, mods, config, util]; // Ajoute 'config' et assure-toi que l'ordre est logique
				return ButtonPages(client.interaction, message, embedPages, 60 * 1000, "gray", "▶", "◀");
			}
		}
	}
};
