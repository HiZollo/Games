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
    return isValid(message.content);
  }

  _buttonFilter = async interaction => {
    if (interaction.user.id !== this.playerHandler.nowPlayer.id) return false;
    return interaction.customId.startsWith(this.name);
  }

  async start() {
    while (this.playerHandler.alive) {
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

      if (this.hardmode) {
        const content = this.boardMessage.content + '\n' + format(this.strings.queryResponse, status.a, status.b, message.content);
        await this.boardMessage.edit({ content });
      }
      else {
        this.content += '\n' + format(this.strings.queryResponse, status.a, status.b, message.content);
        await this.boardMessage.edit({ content: this.content });
      }

      if (this.win(status)) {
        player.status.set("WINNER");
        this.winner = player;
        continue;
      }

      this.playerHandler.next();
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

    let mainContent;
    switch (this.endReason) {
      case "WIN":
        mainContent = format(this.strings.endMessage.win, this.winner.username, this.answer.join(''));
        break;
      case "IDLE":
        mainContent = format(this.strings.endMessage.idle, this.playerHandler.usernames.join(' '));
        break;
      case "STOPPED":
        mainContent = format(this.strings.endMessage.stopped, this.playerHandler.usernames.join(' '));
        break;
    }

    const min = ~~(this.duration/60000);
    const sec = Math.round(this.duration/1000) % 60;
    mainContent += format(this.strings.endMessage.trail, min, fixedDigits(sec, 2), this.playerHandler.totalSteps);

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

const isValid = (number) => {
  if (!/\d{4}/.test(number)) return false;
  const query = getQuery(number);
  return (new Set(query)).size === number.length;
}

const getQuery = (number) => {
  const query = [];
  for (let c of number) {
    query.push(+c);
  }
  return query;
}

module.exports = DCBullsAndCows;
