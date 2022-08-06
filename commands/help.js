const Discord = require('discord.js');

module.exports = {
	name: 'help',
	async execute(message, args) {
		const embed = new Discord.MessageEmbed()
			.setColor('#fa9705')
			.setTitle('Help')
			.setDescription('The help command for this bot.')
			.addFields(
				{ name: 'dog!weather', value: 'Get Sunny\'s current evolution.' },
				{ name: 'dog!speak', value: 'Speak to an AI trained with years of Sunny\'s voice samples to get the world\'s most accurate representation of Sunny\'s voice.' },
				{ name: 'dog!laugh', value: 'Play Sunny\'s laugh (bass boosted) for 6 seconds.' },
				{ name: 'dog!quiz', value: 'Earn/lose social credit for the CCP by answering basic Chinese history questions.' },
			)
			.setTimestamp()
			.setFooter('Made by mcmakkers#9633');

		message.channel.send(embed);
	},
};