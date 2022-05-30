const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const BullsAndCows = require('../games/BullsAndCows.js');
const { createEndEmbed, getInput } = require('../util/DjsUtil.js');
const { format, overwrite } = require('../util/Functions.js');
const { bullsAndCows } = require('../util/strings.json');

class DCBullsAndCows extends BullsAndCows {
  constructor({ players, hardmode, answerLength, time, strings }) {
    super({ players, hardmode, answerLength });

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
        .setLabel(this.strings.controller.stop)
        .setStyle("DANGER")
    );

    super.initialize();

    this.source = source;
    this.client = source?.client;
    this.content = format(this.strings.initial, this.playerManager.nowPlayer.username);

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
    if (message.author.id !== this.playerManager.nowPlayer.id) return false;

    if (message.content !== this.answerLength) return false;
    if (!/^\d+$/.test(message.content)) return false;
    const query = getQuery(message.content);
    return (new Set(query)).size === message.content.length;
  }

  _buttonFilter = async interaction => {
    return interaction.user.id === this.playerManager.nowPlayer.id;
  }

  async _run(nowPlayer) {
    const input = await getInput(this);
    let endStatus = null;

    let content = this.hardmode ? this.mainMessage.content : this.content;
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
        endStatus = "WIN";
      }

      content += '\n' + format(this.strings.query, status.a, status.b, message.content);
      this.content += '\n' + format(this.strings.query, status.a, status.b, message.content);
    }

    this.playerManager.next();
    await this.mainMessage.edit({ content }).catch(() => {
      this.end("DELETED");
    });

    if (endStatus) {
      this.end(endStatus);
    }
  }

  async start() {
    let nowPlayer;
    while (this.ongoing && this.playerManager.alive) {
      nowPlayer = this.playerManager.nowPlayer;
       await this._run(nowPlayer);
    }

    if (this.ongoing) {
      switch (nowPlayer.status.now) {
        case "IDLE":
          this.end("IDLE");
          break;
        case "LEAVING":
          this.end("STOPPED");
          break;
      }
    }
  }

  async end(status) {
    super.end(status);

    await this.mainMessage.edit({ components: [] }).catch(() => {});
  }

  async conclude() {
    if (this.ongoing) {
      throw new Error('The game has not ended.');
    }

    const message = this.strings.endMessages;
    let content;
    switch (this.status.now) {
      case "WIN":
        content = format(message.win, `<@${this.winner.id}>`, this.answer.join(''));
        break;
      case "IDLE":
        content = message.idle;
        break;
      case "STOPPED":
        content = message.stopped;
        break;
      case "DELETED":
        content = message.deleted;
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
