const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const Gomoku = require('../games/Gomoku.js');
const { createEndEmbed, getInput } = require('../util/DjsUtil.js');
const { format, overwrite } = require('../util/Functions.js');
const { gomoku } = require('../util/strings.json');

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

class DjsGomoku extends Gomoku {
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
        .setLabel(this.strings.controller.stop)
        .setStyle("DANGER")
    )

    super.initialize();

    this.source = source;
    this.client = source?.client;
    const content = format(this.strings.nowPlayer, { player: `<@${this.playerManager.nowPlayer.id}>`, symbol: this.playerManager.nowPlayer.symbol });

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
    if (message.author.id !== this.playerManager.nowPlayer.id) return false;
    if (!(/^[A-Za-z]\d{1,2}$/.test(message.content))) return false;

    const [row, col] = getQuery(message.content);
    if (!(0 <= row && row < this.boardSize && 0 <= col && col < this.boardSize)) return false;
    return this.playground[row][col] === null;
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
      content += format(this.strings.previous.idle, { player: nowPlayer.username }) + '\n';
    }
    else if (input.customId?.startsWith('ctrl_')) {
      const [, ...args] = input.customId.split('_');

      if (args[0] === 'stop') {
        await input.update({});
        nowPlayer.status.set("LEAVING");
        content += format(this.strings.previous.leaving, { player: nowPlayer.username }) + '\n';
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

      content = format(this.strings.previous.move, { col: alphabets[col], row: row + 1, player: nowPlayer.username }) + '\n';
    }

    this.playerManager.next();
    content += format(this.strings.nowPlayer, { player: `<@${this.playerManager.nowPlayer.id}>`, symbol: this.playerManager.nowPlayer.symbol }) + '\n';
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

    await this.mainMessage.edit({ content: this.boardContent, components: [] }).catch(() => {});
  }

  async conclude() {
    if (this.ongoing) {
      throw new Error('The game has not ended.');
    }

    const message = this.strings.endMessages;
    let content;
    switch (this.status.now) {
      case "WIN":
        content = format(message.win, { player: `<@${this.winner.id}>` });
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
      content += '\u200b' + this.strings.columns[i];
    }

    for (let i = this.boardSize - 1; i >= 0; i--) {
      content += '\n' + this.strings.rows[i];
      for (let j = 0; j < this.boardSize; j++)
        content += this.playground[i][j] !== null ? this.playground[i][j] : this.strings.grid;
    }
    return content;
  }
}

const getQuery = (content) => {
  let [, col, row] = content.toLowerCase().match(/([a-z])(\d{1,2})/);
  col = col[0].charCodeAt() - 'a'.charCodeAt();
  row = row - 1;
  return [row, col];
}

module.exports = DjsGomoku;