const fs = require('fs');
const Discord = require('discord.js');

const talkedRecently = new Set();

module.exports = {
	name: 'quiz',
	async execute(message) {
		if (talkedRecently.has(message.author.id)) {
			return message.channel.send(error_embed('Wait 5 seconds before typing this command again!', 'Slow down!'));
		}
		else {
			// Adds the user to the set so that they can't talk
			talkedRecently.add(message.author.id);
			setTimeout(() => {
				// Removes the user from the set after a minute
				talkedRecently.delete(message.author.id);
			}, 5000);
		}

		// Get the questions from a JSON file located in this project's main directory
		const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf8'));

		// Get a random question from the questions on Chinese history
		const question = random_element_of(questions.china_history);

		// If it is multiple choice:
		if (question.type == 'multiple_choice') {
			// Shuffle the question's options
			const shuffled_options = shuffle(question.options);

			// Do the whole question for a multiple choice
			get_multiple_choice_answer_from(message, question.prompt, shuffled_options, question.correct_answer);
		}
		else {
			// Do the whole question for a short answer question
			get_short_answer_from(message, question.prompt, question.correct_answer);
		}
	},
};

// Handles the whole question for short answers
const get_short_answer_from = async (message, prompt, correct_answer) => {
	// Function to check if the person who replied is the same
	// as the person who asked the question
	const filter = (response) => {
		return response.author.id == message.author.id;
	};

	message.channel.send(short_answer_embed(prompt))
		.then(() => {
			// Wait for messages. Filter messages with the filter function
			// Only record one response, cancel after 10000 milliseconds
			// and throw an error if they run out of time
			message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
				// With the collected reponse
				.then(collected => {
					// The first answer is the only answer
					const answer = collected.first();

					// If the lowercase answer is the same as the lowercase correct answer:
					if (answer.content.toLowerCase() == correct_answer.toLowerCase()) {
						// Notify the user and give them social credit
						message.channel.send(success_embed('+100 social credit.', 'Right answer!'));
					}
					else {
						// Notify the user and deduct social credit then inform them of the correct answer
						message.channel.send(error_embed(
							'-100 social credit. The correct answer is ' + correct_answer + '.', 'Wrong answer!'));
					}
				})
				.catch(collected => {
					// Notify the user and deduct social credit then inform them of the correct answer
					message.channel.send(error_embed(
						'-100 social credit. The correct answer is ' + correct_answer + '.', 'No answer. '));
					return collected;
				});
		});
};

// Handles the whole question for multiple choice answers
const get_multiple_choice_answer_from = async (message, prompt, options, correct_answer) => {
	// Unicode characters for each letter
	const letters = ['🇦', '🇧', '🇨', '🇩', '🇪'];

	// Gets the letter signifying the correct option
	// by seeing what index the correct option is,
	// then getting the reaction at the index specified in the letters
	const correct_reaction = letters[options.indexOf(correct_answer)];

	// Sends the question prompt, with both the question's title and options.
	const question_prompt = await message.channel.send({
		embed: multiple_choice_question_embed(prompt, options) });

	// For every letter, react to the question prompt with that letter
	letters.forEach(async function(letter) {
		await question_prompt.react(letter);
	});

	// Filters the response so that only the original question asker
	// can answer with one of the available answers
	const filter = (reaction, user) => {
		// The first bit makes sure that only the letters can be selected.
		// Without this, the user can reply with a non-letter emoji
		// and that is counted as an answer
		return letters.includes(reaction.emoji.name) && user.id === message.author.id;
	};

	// Wait for reactions. Filter the reactions by the filter function.
	// Only record one reaction, cancel after 10000 milliseconds
	// and throw an error if no reaction is given after 10000 milliseconds
	question_prompt.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
		// With the collected response:
		.then(collected => {
			// Collected is a map, so we only want the first reaction's data
			const reaction = collected.first();

			// If the reaction is correct
			if (reaction.emoji.name === correct_reaction) {
				// Notify the user and give them social credit
				message.channel.send(success_embed('+100 social credit.', 'Right answer!'));
			}
			else {
				// Notify the user and deduct social credit then inform them of the correct answer
				message.channel.send(error_embed(
					'-100 social credit. The correct answer is ' + correct_answer + '.', 'Wrong answer!'));
			}
		})
		.catch(collected => {
			// Notify the user and deduct social credit then inform them of the correct answer
			message.channel.send(error_embed(
				'-100 social credit. The correct answer is ' + correct_answer + '.', 'No answer. '));
			return collected;
		});
};

// Embed functions
const error_embed = (error, title) => {
	const embed = new Discord.MessageEmbed()
		.setColor('#cc2936')
		.setTitle(title)
		.setDescription(error)
		.setTimestamp()
		.setFooter('Made by mcmakkers#9633');

	return embed;
};

const success_embed = (success, title) => {
	const embed = new Discord.MessageEmbed()
		.setColor('#748e54')
		.setTitle(title)
		.setDescription(success)
		.setTimestamp()
		.setFooter('Made by mcmakkers#9633');

	return embed;
};

const short_answer_embed = (prompt) => {
	const embed = new Discord.MessageEmbed()
		.setColor('#748e54')
		.setTitle('Question')
		.setDescription(prompt)
		.setTimestamp()
		.setFooter('Made by mcmakkers#9633');

	return embed;
};

const multiple_choice_question_embed = (prompt, answers) => {
	// Unicode characters for each letter
	const letters = ['🇦', '🇧', '🇨', '🇩', '🇪'];

	// Stores the options to answer with
	const options = [];

	// For every answer, add the corresponding letter and the answer to the options
	answers.forEach(function(answer) {
		options.push(`${letters[answers.indexOf(answer)]}: ${answer}`);
	});

	// Make the embed with the options as the description joined by new lines.
	const embed = {
		color: 0x748e54,
		title: prompt,
		description: options.join('\n'),
		timestamp: new Date(),
		footer: {
			text: 'Made by mcmakkers#9633',
		},
	};

	return embed;
};

// Helper functinos
const random_element_of = (arr) => {
	return arr[Math.floor(Math.random() * arr.length)];
};

const shuffle = (array) => {
	let cur_id = array.length;

	while (cur_id !== 0) {

		const rand_id = Math.floor(Math.random() * cur_id);
		cur_id -= 1;

		const tmp = array[cur_id];
		array[cur_id] = array[rand_id];
		array[rand_id] = tmp;
	}
	return array;
};