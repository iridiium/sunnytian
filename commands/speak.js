const Discord = require('discord.js');

module.exports = {
	name: 'speak',
	async execute(message, args) {

		const phrases = [
			'geez dat crazy bro',
			'no bitches?',
			'go get some bitches',
			'who asked lol',
			'deez nuts',
			'heheheha',
			'didnt ask',
			'dont care',
			'deez nut',
			'uwu',
			'xue hua piao piao',
			'how abt u do some bitches',
			'hahahai!',
			'is that a skill issue',
		];

		const reply = phrases[Math.floor(Math.random() * phrases.length)];

		const embed = new Discord.MessageEmbed()
			.setColor('#748e54')
			.setTitle('Sunny says:')
			.setDescription(reply)
			.setTimestamp()
			.setFooter('Made by mcmakkers#9633');

		message.channel.send(embed);
	},
};