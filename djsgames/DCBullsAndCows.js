const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const BullsAndCows = require('../games/BullsAndCows.js');
const { createEndEmbed, getInput } = require('../util/DjsUtil.js');
const { format, overwrite } = require('../util/Functions.js');
const { bullsAndCows } = require('../util/strings.json');

class DCBullsAndCows extends BullsAndCows {
  constructor({ players, hardmode, answerLength, numberCount, time, strings }) {
    super({ players, hardmode, answerLength, numberCount });

    this.time = time;
    this.strings = overwrite(JSON.parse(JSON.stringify(bullsAndCows)), strings);

    this.client = null;
    this.source = null;
    this.content = '';
    this.mainMessage = null;

    this._controller = null;
    this._inputMode = 0b101;
  }

  async initialize(source) {
    this._controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('ctrl_stop')
        .setLabel(this.strings.stopButtonMessage)
        .setStyle("DANGER")
    );

    super.initialize();

    this.source = source;
    this.client = source?.client;
    this.content = format(this.strings.firstMessage, this.playerHandler.nowPlayer.username);

    if (source.constructor.name === CommandInteraction.name) {
      if (!source.deferred) {
        await source.deferReply();
      }
      this.mainMessage = await source.editReply({ content: this.content, components: [this._controller] });
    }
    else if (source.constructor.name === Message.name) {
      this.mainMessage = await source.channel.send({ content: this.content, components: [this._controller] });
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
    return interaction.user.id === this.playerHandler.nowPlayer.id;
  }

  async start() {
    let nowPlayer;
    while (!this.ended && this.playerHandler.alive) {
      nowPlayer = this.playerHandler.nowPlayer;
      const input = await getInput(this);

      if (input === null) {
        nowPlayer.status.set("IDLE");
      }
      else if (input.customId?.startsWith('ctrl_')) {
        const [, ...args] = input.customId.split('_');

        if (args[0] === 'stop') {
          await input.update({});
          nowPlayer.status.set("LEAVING");
        }
      }
      else {
        nowPlayer.status.set("PLAYING");
        nowPlayer.addStep();

        const message = input.first();
        await message.delete().catch(() => {});
        const query = getQuery(message.content);
        const status = this.guess(query);

        if (this.win(status)) {
          this.winner = nowPlayer;
          nowPlayer.status.set("WINNER");
        }

        this.playerHandler.next();
        const content = this.hardmode ?
          this.mainMessage.content + '\n' + format(this.strings.queryResponse, status.a, status.b, message.content) :
          this.content += '\n' + format(this.strings.queryResponse, status.a, status.b, message.content);
        await this.mainMessage.edit({ content }).catch(() => {
          this.end("DELETED");
        });
      }
    }

    switch (nowPlayer.status.now) {
      case "WINNER":
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

  async end(reason) {
    super.end(reason);

    await this.mainMessage.edit({ components: [] }).catch(() => {});
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
    await this.mainMessage.reply({ content, embeds }).catch(() => {
      this.source.channel.send({ content, embeds });
    });
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
