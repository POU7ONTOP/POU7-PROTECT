const Discord = require('discord.js')
const db = require('quick.db')

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}
module.exports = {
	name: 'eval',
	aliases: [],
	run: async (client, message, args, prefix, color) => {

		// MODIFIÉ : Utilise client.config.owner pour la permission
		if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true) {

			const content = args.join(" ")
			const result = new Promise((resolve) => resolve(eval(content)));

			return result.then((output) => {
				if (typeof output !== "string") {
					output = require("util").inspect(output, {
						depth: 0
					});
				}


				message.channel.send(output, {
					code: "js"
				});
			}).catch((err) => {
				err = err.toString();

				message.channel.send(err, {
					code: "js"
				});
			});
		} else {
            return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
        }

	}
}
