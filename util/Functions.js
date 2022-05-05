const { MessageEmbed } = require('discord.js');

function createEndEmbed(game) {
  const message = game.strings.endMessage;
  const min = ~~(game.duration/60000);
  const sec = fixedDigits(Math.round(game.duration/1000) % 60, 2);

  const embed = new MessageEmbed()
    .setAuthor({ name: message.gameStats.header + game.name, iconURL: game.client.user.displayAvatarURL() })
    .setColor(0x000000)
    .setDescription(format(message.gameStats.message, min, sec, game.playerHandler.totalSteps));

  if (game.playerHandler.playerCount > 1) {
    for (const player of game.playerHandler.players) {
      const m = ~~(player.time/60000);
      const s = fixedDigits(Math.round(player.time/1000) % 60, 2);
      embed.addField(player.username, format(message.playerStats.message, m, s, player.steps), true);
    }
  }

  return embed;
}

function fixedDigits(integer, digits) {
  const string = `${integer}`;

  if (digits <= string.length) return string;
  return '0'.repeat(digits - string.length) + string;
}

function format(string, ...str) {
  str.forEach((s, i) => {
    string = string.replaceAll(`%s${i+1}`, s);
  });
  string = string.replace(/\%s\d+/g, '');
  return string;
}

function overwrite(obj1, obj2) {
  for (let key in obj2) {
    obj1[key] = (typeof obj2[key] === 'object') ? overwrite(obj1[key] ?? {}, obj2[key]) : obj2[key];
  }
  return obj1;
}

function sleep(time, message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(message);
    }, time);
  });
}

module.exports = {
  createEndEmbed, fixedDigits, format, overwrite, sleep
};
