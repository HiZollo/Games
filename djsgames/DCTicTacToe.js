const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const TicTacToe = require('../games/TicTacToe.js');
const { createEndEmbed, getInput } = require('../util/DjsUtil.js');
const { format, overwrite } = require('../util/Functions.js');
const { ticTacToe } = require('../util/strings.json');

class DCTicTacToe extends TicTacToe {
  constructor({ players, boardSize = 3, time, strings }) {
    if (boardSize > 4)
      throw new Error('The size of the board should be at most 4.');

    super({ players, boardSize });

    this.time = time;
    this.strings = overwrite(JSON.parse(JSON.stringify(ticTacToe)), strings);

    this.client = null;
    this.source = null;
    this.mainMessage = null;

    this._board = [];
    this._controller = null;
    this._inputMode = 0b100;
  }

  async initialize(source) {
    for (let i = 0; i < this.boardSize; i++) {
      this._board.push([]);
      for (let j = 0; j < this.boardSize; j++) {
        this._board[i].push(new MessageButton()
          .setCustomId(`game_${i}_${j}`)
          .setLabel(this.strings.labels[i][j])
          .setStyle("PRIMARY")
        );
      }
    }
    this._controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('ctrl_stop')
        .setLabel(this.strings.stopButtonMessage)
        .setStyle("DANGER")
    );

    super.initialize();

    this.source = source;
    this.client = source?.client;
    const content = format(this.strings.nowPlayer, `<@${this.playerManager.nowPlayer.id}>`);

    if (source.constructor.name === CommandInteraction.name) {
      if (!source.deferred) {
        await source.deferReply();
      }
      this.mainMessage = await source.editReply({ content: content, components: this.components });
    }
    else if (source.constructor.name === Message.name) {
      this.mainMessage = await source.channel.send({ content: content, components: this.components });
    }
    else {
      throw new Error('The source is neither an instance of CommandInteraction nor an instance of Message.');
    }
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
      await input.update({});
      nowPlayer.status.set("PLAYING");
      nowPlayer.addStep();

      const [, ...args] = input.customId.split('_').map(a => parseInt(a, 10));
      this.fill(args[0], args[1]);

      if (this.win(args[0], args[1])) {
        this.winner = nowPlayer;
        endStatus = "WIN";
      }
      else if (this.draw()) {
        endStatus = "DRAW";
      }
    }

    this.playerManager.next();
    content += format(this.strings.nowPlayer, `<@${this.playerManager.nowPlayer.id}>`);
    await this.mainMessage.edit({ content, components: this.components }).catch(() => {
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

  fill(row, col) {
    super.fill(row, col);

    this._board[row][col]
      .setDisabled(true)
      .setLabel(this.playground[row][col]);
  }

  async end(status) {
    super.end(status);

    this._board.forEach(row => {
      row.forEach(button => {
        button.setDisabled(true);
      })
    });
    await this.mainMessage.edit({ content: '\u200b', components: this.components }).catch(() => {});
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

  get components() {
    const actionRows = [];
    for (let i = 0; i < this.boardSize; i++) {
      actionRows.push(new MessageActionRow());
      for (let j = 0; j < this.boardSize; j++) {
        actionRows[i].addComponents(this._board[i][j]);
      }
    }

    if (!this.ended) {
      actionRows.push(this._controller);
    }
    return actionRows;
  }
}

const getQuery = (content) => {
  content = content.toLowerCase();
  const row = content.substr(1, 2) - 1;
  const col = content.substr(0, 1).charCodeAt() - 'a'.charCodeAt();
  return [row, col];
}

module.exports = DCTicTacToe;
