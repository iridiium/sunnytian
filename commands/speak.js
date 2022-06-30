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
			'deez nut',
			'xue hua piao piao',
			'is that a skill issue',
			'kys',
			'*among us theme but it\'s dings*',
			'IT MORBIN TIME',
			'cba',
			'can you find who asked?',
			'how abt u get some bitches',
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