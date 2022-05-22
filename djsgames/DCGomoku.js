const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const Gomoku = require('../games/Gomoku.js');
const { createEndEmbed, getInput } = require('../util/DjsUtil.js');
const { format, overwrite } = require('../util/Functions.js');
const { gomoku } = require('../util/strings.json');

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

class DCGomoku extends Gomoku {
  constructor({ players, boardSize = 9, time, strings }) {
    super({ players, boardSize });

    this.time = time;
    this.strings = overwrite(JSON.parse(JSON.stringify(gomoku)), strings);

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
        .setLabel(this.strings.stopButtonMessage)
        .setStyle("DANGER")
    )

    super.initialize();

    this.source = source;
    this.client = source?.client;
    const content = format(this.strings.nowPlayer, `<@${this.playerHandler.nowPlayer.id}>`);

    if (source.constructor.name === CommandInteraction.name) {
      if (!source.deferred) {
        await source.deferReply();
      }
      this.mainMessage = await source.editReply({ content: content + '\n' + this.boardContent, components: [this._controller] });
    }
    else if (source.constructor.name === Message.name) {
      this.mainMessage = await source.channel.send({ content: content + '\n' + this.boardContent, components: [this._controller] });
    }
    else {
      throw new Error('The source is neither an instance of CommandInteraction nor an instance of Message.');
    }
  }

  _messageFilter = async message => {
    if (message.author.id !== this.playerHandler.nowPlayer.id) return false;
    if (!(/^[A-Za-z]\d{1,2}$/.test(message.content))) return false;

    const [row, col] = getQuery(message.content);
    if (!(0 <= row && row < this.boardSize && 0 <= col && col < this.boardSize)) return false;
    return this.playground[row][col] === null;
  }

  _buttonFilter = async interaction => {
    return interaction.user.id === this.playerHandler.nowPlayer.id;
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
      const [row, col] = getQuery(message.content);
      this.fill(row, col);

      if (this.win(row, col)) {
        this.winner = nowPlayer;
        endStatus = "WIN";
      }
      else if (this.draw()) {
        endStatus = "DRAW";
      }

      content = format(this.strings.previous.move, alphabets[row], col + 1, nowPlayer.username) + '\n';
    }

    this.playerHandler.next();
    content += format(this.strings.nowPlayer, `<@${this.playerHandler.nowPlayer.id}>`) + '\n';
    content += this.boardContent;
    await this.mainMessage.edit({ content }).catch(() => {
      this.end("DELETED");
    });

    if (endStatus) {
      this.end(endStatus);
    }
  }

  async start() {
    let nowPlayer;
    while (this.ongoing && this.playerHandler.alive) {
      nowPlayer = this.playerHandler.nowPlayer;
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

    await this.mainMessage.edit({ content: this.boardContent, components: [] }).catch(() => {});
  }

  async conclude() {
    if (this.ongoing) {
      throw new Error('The game has not ended.');
    }

    const message = this.strings.endMessage;
    let content;
    switch (this.status.now) {
      case "WIN":
        content = format(message.win, `<@${this.winner.id}>`);
        break;
      case "IDLE":
        content = message.idle;
        break;
      case "DRAW":
        content = message.draw;
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

  get boardContent() {
    let content = `${this.strings.corner}`;
    for (let i = 0; i < this.boardSize; i++) {
      content += this.strings.columns[i];
    }

    for (let i = 0; i < this.boardSize; i++) {
      content += '\n' + this.strings.rows[i];
      for (let j = 0; j < this.boardSize; j++)
        content += this.playground[i][j] !== null ? this.playground[i][j] : this.strings.grid;
    }
    return content;
  }
}

const getQuery = (content) => {
  let [, row, col] = content.toLowerCase().match(/([a-z])(\d{1,2})/);
  row = row[0].charCodeAt() - 'a'.charCodeAt();
  col = col - 1;
  return [row, col];
}

module.exports = DCGomoku;
