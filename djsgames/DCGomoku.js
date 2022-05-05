const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const Gomoku = require('../games/Gomoku.js');
const { createEndEmbed, format, overwrite } = require('../util/Functions.js');
const { gomoku } = require('../util/strings.json');

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

class DCGomoku extends Gomoku {
  constructor({ players, boardSize = 9, time, strings }) {
    super({ players, boardSize });

    this.time = time;
    this.strings = overwrite(JSON.parse(JSON.stringify(gomoku)), strings);

    this.client = null;
    this.source = null;
    this.boardMessage = null;
  }

  async initialize(source) {
    super.initialize();

    this.source = source;
    this.client = source?.client;
    const content = format(this.strings.nowPlayer, `<@${this.playerHandler.nowPlayer.id}>`);

    if (source.constructor.name === CommandInteraction.name) {
      if (!source.deferred) {
        await source.deferReply();
      }
      this.boardMessage = await source.editReply({ content: content + '\n' + this.boardContent, components: this.components });
    }
    else if (source.constructor.name === Message.name) {
      this.boardMessage = await source.channel.send({ content: content + '\n' + this.boardContent, components: this.components });
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

      let content = '';
      if (result.customId === `${this.name}_stop`) {
        await result.update({});

        player.status.set("LEAVING");
        content = format(this.strings.previous.leaving, player.username) + '\n';
        this.playerHandler.next();
      }
      else if (!result.size) {
        player.status.set("IDLE");
        content = format(this.strings.previous.idle, player.username) + '\n';
        this.playerHandler.next();
      }
      else {
        player.status.set("PLAYING");
        player.addStep();

        const message = result.first();
        await message.delete().catch(() => {});
        const [row, col] = getQuery(message.content);

        this.fill(row, col);

        if (this.win(row, col)) {
          player.status.set("WINNER");
          this.winner = player;
          this.end("WIN");
        }
        else if (this.draw()) {
          this.end("DRAW");
        }
        else {
          this.playerHandler.next();
        }

        content = format(this.strings.previous.move, alphabets[col], row + 1, player.username) + '\n';
      }

      content += format(this.strings.nowPlayer, `<@${this.playerHandler.nowPlayer.id}>`) + '\n';
      content += this.boardContent;
      await this.boardMessage.edit({ content }).catch(() => {
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

    await this.boardMessage.edit({ components: [] });

    if ([CommandInteraction.name, Message.name].includes(this.source.constructor.name)) {
      await this.boardMessage.reply({ content, embeds });
    }
    else {
      throw new Error('The source is neither an instance of CommandInteraction nor an instance of Message.');
    }
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

const getQuery = (content) => {
  content = content.toLowerCase();
  const row = content.substr(1, 2) - 1;
  const col = content.substr(0, 1).charCodeAt() - 'a'.charCodeAt();
  return [row, col];
}

module.exports = DCGomoku;
