const Discord = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const API_KEY = process.env.API_KEY;
const LATITUDE = process.env.LATITUDE;
const LONGITUDE = process.env.LONGITUDE;

module.exports = {
	name: 'weather',
	async execute(message, args) {
		axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${API_KEY}`)

			.then(function(response) {
				console.log(response);
				const date = new Date(response.data.dt * 1000).toGMTString();

				const weatherEmbed = new Discord.MessageEmbed()
					.setColor('#748e54')
					.setTitle(`${response.data.weather[0].main} Tian!`)
					.setDescription(`In ${response.data.name} at ${date}`)
					.addFields(
						{ name: 'Temperature (°C)', value: Math.round((response.data.main.temp - 273.15) * 10) / 10, inline: true },
						{ name: 'Humidity (%):', value: response.data.main.humidity, inline: true },
						{ name: 'Pressure (hPa):', value: response.data.main.pressure, inline: true },
						{ name: 'Wind speed (m/s):', value: response.data.wind.speed, inline: true },
						{ name: 'Cloudiness (%):', value: response.data.clouds.all, inline: true },
					)
					.setTimestamp()
					.setFooter('Made by mcmakkers#9633');

				message.channel.send(weatherEmbed);
			})

			.catch(function(error) {
				message.channel.send(error_embed(error));
			});
	},
};

const error_embed = (error) => {
	const embed = new Discord.MessageEmbed()
		.setColor('#cc2936')
		.setTitle('An error has occured!')
		.setDescription(error)
		.setTimestamp()
		.setFooter('Made by mcmakkers#9633');

	return embed;
};
