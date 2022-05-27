const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const FinalCode = require('../games/FinalCode.js');
const { createEndEmbed, getInput } = require('../util/DjsUtil.js');
const { format, overwrite } = require('../util/Functions.js');
const { finalCode } = require('../util/strings.json');

class DCFinalCode extends FinalCode {
  constructor({ players, min, max, time, strings }) {
    super({ players, min, max });

    this.time = time;
    this.strings = overwrite(JSON.parse(JSON.stringify(finalCode)), strings);

    this.client = null;
    this.source = null;
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
    let content = format(this.strings.interval, this.min, this.max) + '\n';
    content += format(this.strings.nowPlayer, `<@${this.playerManager.nowPlayer.id}>`);

    if (source.constructor.name === CommandInteraction.name) {
      if (!source.deferred) {
        await source.deferReply();
      }
      this.mainMessage = await source.editReply({ content: content, components: [this._controller] });
    }
    else if (source.constructor.name === Message.name) {
      this.mainMessage = await source.channel.send({ content: content, components: [this._controller] });
    }
    else {
      throw new Error('The source is neither an instance of CommandInteraction nor an instance of Message.');
    }
  }

  _messageFilter = async message => {
    if (message.author.id !== this.playerManager.nowPlayer.id) return false;

    const query = +message.content;
    if (isNaN(query) || query !== ~~query) return false;
    return this.min < query && query < this.max;
  }

  _buttonFilter = async interaction => {
    return interaction.user.id === this.playerManager.nowPlayer.id;
  }

  async _run(nowPlayer) {
    const input = await getInput(this);
    let endStatus = null;

    let content = '\u200b';
    if (input === null) {
      nowPlayer.status.set("IDLE");
      content += format(this.strings.previous.idle, nowPlayer.username) + '\n';
    }
    else if (input.customId?.startsWith('ctrl_')) {
      const [, ...args] = input.customId.split('_');

      if (args[0] === 'stop') {
        await input.update({});
        nowPlayer.status.set("LEAVING");
        content += format(this.strings.previous.leaving, nowPlayer.username) + '\n';
      }
    }
    else {
      nowPlayer.status.set("PLAYING");
      nowPlayer.addStep();

      const message = input.first();
      await message.delete().catch(() => {});
      const query = +message.content;
      const result = this.guess(query);

      if (result === 0) {
        this.winner = nowPlayer;
        endStatus = "WIN";
      }
      else {
        content += result > 0 ?
          format(this.strings.previous.guess, query, this.strings.compare.large) + '\n' :
          format(this.strings.previous.guess, query, this.strings.compare.small) + '\n';
      }
    }

    this.playerManager.next();
    content += format(this.strings.interval, this.min, this.max) + '\n';
    content += format(this.strings.nowPlayer, `<@${nowPlayer.id}>`);
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

    await this.mainMessage.edit({ content: format(this.strings.interval, this.min, this.max), components: [] }).catch(() => {});
  }

  async conclude() {
    if (this.ongoing) {
      throw new Error('The game has not ended.');
    }

    const message = this.strings.endMessages;
    let content;
    switch (this.status.now) {
      case "WIN":
        content = format(message.win, `<@${this.winner.id}>`, this.answer);
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

module.exports = DCFinalCode;
