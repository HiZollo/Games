const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const TicTacToe = require('../games/TicTacToe.js');
const { createEndEmbed, format, overwrite, sleep } = require('../util/Functions.js');
const { ticTacToe } = require('../util/strings.json');

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

class DCTicTacToe extends TicTacToe {
  constructor({ players, boardSize, time, strings }) {
    super({ players, boardSize });

    this.time = time;
    this.strings = overwrite(JSON.parse(JSON.stringify(ticTacToe)), strings);

    this.client = null;
    this.source = null;
    this.boardMessage = null;
    this._board = [];
    this._controller = [];
  }

  async initialize(source) {
    for (let i = 0; i < this.boardSize; i++) {
      this._board.push([]);
      for (let j = 0; j < this.boardSize; j++) {
        this._board[i].push(new MessageButton()
          .setCustomId(`${this.name}_${i}_${j}`)
          .setLabel(this.strings.labels[i][j])
          .setStyle("PRIMARY")
        );
      }
    }
    this._controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`${this.name}_stop`)
        .setLabel(this.strings.stopButtonMessage)
        .setStyle("DANGER")
    );

    super.initialize();

    this.source = source;
    this.client = source?.client;
    const content = format(this.strings.nowPlayer, `<@${this.playerHandler.nowPlayer.id}>`);

    if (source.constructor.name === CommandInteraction.name) {
      if (!source.deferred) {
        await source.deferReply();
      }
      this.boardMessage = await source.editReply({ content: content, components: this.components });
    }
    else if (source.constructor.name === Message.name) {
      this.boardMessage = await source.channel.send({ content: content, components: this.components });
    }
    else {
      throw new Error('The source is neither an instance of CommandInteraction nor an instance of Message.');
    }
  }

  _filter = async interaction => {
    if (interaction.user.id !== this.playerHandler.nowPlayer.id) return false;
    return interaction.customId.startsWith(this.name);
  }

  async start() {
    while (!this.ended && this.playerHandler.alive) {
      const result = await Promise.any([
        sleep(this.time, { customId: `${this.name}_idle` }),
        this.boardMessage.awaitMessageComponent({ filter: this._filter, componentType: "BUTTON", time: this.time + 3e3 })
      ]);
      const player = this.playerHandler.nowPlayer;
      const [, arg1, arg2] = result.customId.split('_');

      let content = '';
      if (arg1 === 'stop') {
        await result.update({});
        player.status.set("LEAVING");
        content = format(this.strings.previous.leaving, player.username) + '\n';
        this.playerHandler.next();
      }
      else if (arg1 === 'idle') {
        player.status.set("IDLE");
        content = format(this.strings.previous.idle, player.username) + '\n';
        this.playerHandler.next();
      }
      else {
        await result.update({});
        player.status.set("PLAYING");
        player.addStep();

        const [row, col] = [parseInt(arg1, 10), parseInt(arg2, 10)];
        this.fill(row, col);

        if (this.win(row, col)) {
          this.winner = player;
          this.end("WIN");
        }
        else if (this.draw()) {
          this.end("DRAW");
        }
        else {
          this.playerHandler.next();
        }
      }

      content += format(this.strings.nowPlayer, `<@${this.playerHandler.nowPlayer.id}>`);
      await this.boardMessage.edit({ content, components: this.components }).catch(() => {
        this.end("DELETED");
      });
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

  fill(row, col) {
    super.fill(row, col);

    this._board[row][col]
      .setDisabled(true)
      .setLabel(this.playground[row][col]);
  }

  async end(reason) {
    super.end(reason);

    this._board.forEach(row => {
      row.forEach(button => {
        button.setDisabled(true);
      })
    });
    await this.boardMessage.edit({ content: '\u200b', components: this.components }).catch(() => {});
  }

  async conclude() {
    if (!this.ended) {
      throw new Error('The game has not ended.');
    }

    const message = this.strings.endMessage;
    let content;
    switch (this.endReason) {
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
    await this.boardMessage.reply({ content, embeds }).catch(() => {
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
