const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const BullsAndCows = require('../games/BullsAndCows.js');
const { createEndEmbed, fixedDigits, format, overwrite, sleep } = require('../util/Functions.js');
const { bullsAndCows } = require('../util/strings.json');

class DCBullsAndCows extends BullsAndCows {
  constructor({ players, hardmode, answerLength, numberCount, time, strings }) {
    super({ players, hardmode, answerLength, numberCount });

    this.time = time;
    this.strings = overwrite(JSON.parse(JSON.stringify(bullsAndCows)), strings);

    this.client = null;
    this.source = null;
    this.content = '';
    this.boardMessage = null;
  }

  async initialize(source) {
    super.initialize();

    this.source = source;
    this.client = source?.client;
    this.content = format(this.strings.firstMessage, this.playerHandler.nowPlayer.username);

    if (source.constructor.name === CommandInteraction.name) {
      if (!source.deferred) {
        await source.deferReply();
      }
      this.boardMessage = await source.editReply({ content: this.content, components: this.components });
    }
    else if (source.constructor.name === Message.name) {
      this.boardMessage = await source.channel.send({ content: this.content, components: this.components });
    }
    else {
      throw new Error('The source is neither an instance of CommandInteraction nor an instance of Message.');
    }
  }

  _messageFilter = async message => {
    if (message.author.id !== this.playerHandler.nowPlayer.id) return false;

    if (!/^\d{4}$/.test(message.content)) return false;
    const query = getQuery(message.content);
    return (new Set(query)).size === message.content.length;
  }

  _buttonFilter = async interaction => {
    if (interaction.user.id !== this.playerHandler.nowPlayer.id) return false;
    return interaction.customId.startsWith(this.name);
  }

  async start() {
    while (!this.ended && this.playerHandler.alive) {
      const result = await Promise.any([
        sleep(this.time, { customId: `${this.name}_idle` }),
        this.source.channel.awaitMessages({ filter: this._messageFilter, max: 1 }),
        this.boardMessage.awaitMessageComponent({ filter: this._buttonFilter, componentType: "BUTTON" })
      ]);
      const player = this.playerHandler.nowPlayer;

      if (result.customId === `${this.name}_stop`) {
        await result.update({});
        player.status.set("LEAVING");
        continue;
      }

      if (result.customId === `${this.name}_idle`) {
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
        this.winner = player;
        this.end("WIN");
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
      case "IDLE":
        this.end("IDLE");
        break;
      case "LEAVING":
        this.end("STOPPED");
        break;
    }
  }

  async end(reason) {
    super.end(reason);

    await this.boardMessage.edit({ components: [] }).catch(() => {});
  }

  async conclude() {
    if (!this.ended) {
      throw new Error('The game has not ended.');
    }

    const message = this.strings.endMessage;
    let content;
    switch (this.endReason) {
      case "WIN":
        content = format(message.win, `<@${this.winner.id}>`, this.answer.join(''));
        break;
      case "IDLE":
        content = message.idle;
        break;
      case "STOPPED":
        content = message.stopped;
        break;
    }

    const embeds = [createEndEmbed(this)];
    if ([CommandInteraction.name, Message.name].includes(this.source.constructor.name)) {
      await this.boardMessage.reply({ content, embeds }).catch(() => {
        this.source.channel.send({ content, embeds });
      });
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
