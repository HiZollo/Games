const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const BullsAndCows = require('../games/BullsAndCows.js');
const { fixedDigits, format, overwrite } = require('../util/Functions.js');
const { bullsAndCows } = require('../util/strings.json');

class DCBullsAndCows extends BullsAndCows {
  constructor({ players, hardmode, answerLength, numberCount, time, strings }) {
    super({ players, hardmode, answerLength, numberCount });

    this.time = time;
    this.strings = overwrite(JSON.parse(JSON.stringify(bullsAndCows)), strings);

    this.content = '';
    this.boardMessage = null;
    this.source = null;
  }

  async initialize(source) {
    this.source = source;
    if (source.constructor.name === CommandInteraction.name) {
      if (!source.deferred) {
        await source.deferReply();
      }
      super.initialize();

      this.content = format(this.strings.firstMessage, this.playerHandler.nowPlayer.username);
      this.boardMessage = await source.editReply({ content: this.content, components: this.components });
    }
    else if (source.constructor.name === Message.name) {
      super.initialize();

      this.content = format(this.strings.firstMessage, this.playerHandler.nowPlayer.username);
      this.boardMessage = await source.channel.send({ content: this.content, components: this.components });
    }
    else {
      throw new Error('The source is neither an instance of CommandInteraction nor an instance of Message.');
    }
  }

  _messageFilter = async message => {
    if (message.author.id !== this.playerHandler.nowPlayer.id) return false;

    if (!/^\d{4}$/.test(number)) return false;
    const query = getQuery(number);
    return (new Set(query)).size === number.length;
  }

  _buttonFilter = async interaction => {
    if (interaction.user.id !== this.playerHandler.nowPlayer.id) return false;
    return interaction.customId.startsWith(this.name);
  }

  async start() {
    while (!this.ended && this.playerHandler.alive) {
      const result = await Promise.race([
        this.source.channel.awaitMessages({ filter: this._messageFilter, time: this.time, max: 1 }),
        this.boardMessage.awaitMessageComponent({ filter: this._buttonFilter, time: this.time, componentType: "BUTTON" })
      ]);
      const player = this.playerHandler.nowPlayer;

      if (result.customId === `${this.name}_stop`) {
        player.status.set("LEAVING");
        continue;
      }

      if (!result.size) {
        player.status.set("IDLE");
        continue;
      }

      player.status.set("PLAYING");
      player.addStep();

      const message = result.first();
      await message.delete().catch(() => {});
      const query = getQuery(message.content);
      const status = this.guess(query);

      if (this.win(status)) {
        player.status.set("WINNER");
        this.winner = player;
      }
      else {
        this.playerHandler.next();
      }

      if (this.hardmode) {
        const content = this.boardMessage.content + '\n' + format(this.strings.queryResponse, status.a, status.b, message.content);
        await this.boardMessage.edit({ content });
      }
      else {
        this.content += '\n' + format(this.strings.queryResponse, status.a, status.b, message.content);
        await this.boardMessage.edit({ content: this.content });
      }
    }

    switch (this.playerHandler.nowPlayer.status.now) {
      case "WINNER": case "BOT":
        this.end("WIN");
        break;
      case "IDLE":
        this.end("IDLE");
        break;
      case "LEAVING":
        this.end("STOPPED");
        break;
    }
  }

  async conclude() {
    if (!this.ended) {
      throw new Error('The game has not ended.');
    }

    const message = this.strings.endMessage;

    let mainContent;
    switch (this.endReason) {
      case "WIN":
        mainContent = format(message.win, `<@${this.winner.id}>`, this.answer.join(''));
        break;
      case "IDLE":
        mainContent = message.idle;
        break;
      case "STOPPED":
        mainContent = message.stopped;
        break;
    }

    const min = ~~(this.duration/60000);
    const sec = fixedDigits(Math.round(this.duration/1000) % 60, 2);
    if (this.playerHandler.playerCount === 1) {
      mainContent += '\n' + message.gameStats.header + '\n';
      mainContent += format(message.playerStats.message, `<@${this.playerHandler.nowPlayer.id}>`, min, sec, this.playerHandler.nowPlayer.steps) + '\n';
    }
    else {
      mainContent += '\n' + message.gameStats.header + '\n';
      mainContent += format(message.gameStats.message, min, sec, this.playerHandler.totalSteps) + '\n';
      mainContent += message.playerStats.header + '\n';
      for (const player in this.playerHandler.players) {
        const m = ~~(player.time/60000);
        const s = fixedDigits(Math.round(player.time/1000) % 60, 2);
        mainContent += format(message.playerStats.message, player.username, m, s, player.steps) + '\n';
      }
    }

    await this.boardMessage.edit({ components: [] });

    if (this.source.constructor.name === CommandInteraction.name) {
      await this.source.followUp(mainContent);
    }
    else if (this.source.constructor.name === Message.name) {
      await this.source.channel.send(mainContent);
    }
    else {
      throw new Error('The source is neither an instance of CommandInteraction nor an instance of Message.');
    }
  }

  get components() {
    return [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(`${this.name}_stop`)
          .setLabel(this.strings.stopButtonMessage)
          .setStyle("DANGER")
      )
    ];
  }
}

const getQuery = (number) => {
  const query = [];
  for (let c of number) {
    query.push(+c);
  }
  return query;
}

module.exports = DCBullsAndCows;
