const Discord = require('discord.js')
const keep_alive = require('./keep_alive.js')
const client = new Discord.Client({
	fetchAllMembers: true,
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
	intents: [
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
		Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_BANS, // Assure-toi que cet intent est activé
		Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
		Discord.Intents.FLAGS.GUILD_INVITES,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Discord.Intents.FLAGS.GUILD_PRESENCES,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
		Discord.Intents.FLAGS.GUILD_WEBHOOKS,
	]
})

// AJOUTÉ : Initialisation de client.commands
client.commands = new Discord.Collection();

const {
	readdirSync
} = require("fs")
const db = require('quick.db')
const ms = require("ms")
const {
	MessageEmbed
} = require('discord.js')
const {
	login
} = require("./util/login.js");
login(client)
process.on("unhandledRejection", err => {
	if (err.message) return
	console.error("Uncaught Promise Error: ", err);
})
const loadCommands = (dir = "./commands/") => {
	readdirSync(dir).forEach(dirs => {
		const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

		for (const file of commands) {
			const getFileName = require(`${dir}/${dirs}/${file}`);
			client.commands.set(getFileName.name, getFileName);
			console.log(`> Commande Chargée ${getFileName.name} [${dirs}]`)
		};
	});
};
client.config = require('./config.json');
require("discord-buttons")(client);
client.on('ready', async () => {
	console.log(`${client.user.username} connecté !`);
	client.user.setActivity(`${client.config.name}`, {
		type: "STREAMING",
		url: "https://www.twitch.tv/discord"
	});
	loadCommands(); // Assure-toi que c'est bien là
	console.log(`Chargement de ${client.commands.size} commandes !`);
});

client.on('message', async (message) => {
	if (message.author.bot || message.channel.type === "dm") return;

	let prefix = db.get(`prefix_${message.guild.id}`) || client.config.prefix;
	let color = client.config.color;

	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	try {
		command.run(client, message, args, prefix, color);
	} catch (error) {
		console.error(error);
		message.reply('Une erreur est survenue lors de l\'exécution de cette commande.');
	}
});

// AJOUTÉ : Système de Bannissement Global (Événements)
client.on('guildBanAdd', async (guild, user) => {
    let blacklistedUsers = db.get('blacklistedUsers') || [];
    if (blacklistedUsers.includes(user.id)) {
        // Si l'utilisateur est globalement blacklisté, essaie de le bannir à nouveau
        try {
            await guild.members.ban(user.id, { reason: 'Blacklisté globalement par le propriétaire du bot (re-bannissement)' });
            console.log(`Re-banni ${user.tag} dans ${guild.name} car il est globalement blacklisté.`);
        } catch (error) {
            console.error(`Échec du re-bannissement de ${user.tag} dans ${guild.name} :`, error);
        }
    }
});

client.on('guildBanRemove', async (guild, user) => {
    let blacklistedUsers = db.get('blacklistedUsers') || [];
    if (blacklistedUsers.includes(user.id)) {
        // Si l'utilisateur est globalement blacklisté, bannis-le immédiatement à nouveau
        try {
            await guild.members.ban(user.id, { reason: 'Blacklisté globalement par le propriétaire du bot (re-bannissement automatique)' });
            console.log(`Re-banni automatiquement ${user.tag} dans ${guild.name} après le débannissement car il est globalement blacklisté.`);
        } catch (error) {
            console.error(`Échec du re-bannissement automatique de ${user.tag} dans ${guild.name} :`, error);
        }
    }
});

client.login(process.env.TOKEN);
