const Discord = require('discord.js');

module.exports = {
  name: 'weather',
  async execute(message, args, cmd) {
    message.channel.send('sunny tian');
  },
};
