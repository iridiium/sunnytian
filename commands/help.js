const Discord = require('discord.js');

module.exports = {
	name: 'help',
	async execute(message, args, cmd) {
		const embed = new Discord.MessageEmbed()
			.setColor('#fa9705')
			.setTitle('Help')
			.setDescription('The help command for this bot.')
			.addFields(
				{ name: 'dog!weather', value: 'Get Sunny\'s current evolution.' },
				{ name: 'dog!speak', value: 'Speak to an AI trained with years of Sunny\'s voice samples to get the world\'s most accurate representation of Sunny\'s voice.' },
			)
			.setTimestamp()
			.setFooter('Made by mcmakkers#9633');

		message.channel.send(embed);
	},
};