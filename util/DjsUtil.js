const { MessageEmbed } = require('discord.js');
const { fixedDigits, format, sleep } = require('./Functions.js');

/**
 * Makes an endgame embed for an implemented djs game.
 * @param {ImplementedGame} game
 * @returns {MessageEmbed} the endgame embed for this game
 */
function createEndEmbed(game) {
  const message = game.strings.endMessages;
  const min = ~~(game.duration/60000);
  const sec = fixedDigits(Math.round(game.duration/1000) % 60, 2);

  const embed = new MessageEmbed()
    .setAuthor({ name: format(message.gameStats.header, game.strings.name), iconURL: game.client.user.displayAvatarURL() })
    .setColor(0x000000)
    .setDescription(format(message.gameStats.message, min, sec, game.playerManager.totalSteps));

  if (game.playerManager.playerCount > 1) {
    for (const player of game.playerManager.players) {
      const m = ~~(player.time/60000);
      const s = fixedDigits(Math.round(player.time/1000) % 60, 2);
      embed.addField(player.username, format(message.playerStats.message, m, s, player.steps), true);
    }
  }

  return embed;
}

/**
 * Gets user input from API.
 * @param {ImplementedGame} game
 * @returns {?ButtonInteraction|Collection<Snowflake,Message>} the user input
 */
async function getInput(game) {
  // Since awaitMessageComponent() may reject, a must-resolving Promise is needed
  const promises = [sleep(game.time, null)];

  // button input from main message
  if (game._inputMode & 0b100)
    promises.push(game.mainMessage.awaitMessageComponent({
      filter: game._buttonFilter,
      componentType: "BUTTON",
      time: game.time
    }));

  // button input from controller message
  if (game._inputMode & 0b010)
    promises.push(game.controllerMessage.awaitMessageComponent({
      filter: game._buttonFilter,
      componentType: "BUTTON",
      time: game.time
    }));

  // message input from same channel
  if (game._inputMode & 0b001)
    promises.push(game.source.channel.awaitMessages({
      filter: game._messageFilter,
      max: 1,
      time: game.time
    }));

  const input = await Promise.any(promises);
  return input;
}

module.exports = {
  createEndEmbed, getInput
};
