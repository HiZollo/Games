const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const LightsUp = require('../games/LightsUp.js');
const { createEndEmbed, format, overwrite, sleep } = require('../util/Functions.js');
const { lightsUp } = require('../util/strings.json');

class DCLightsUp extends LightsUp {
  constructor({ players, boardSize = 5, time, strings }) {
    if (boardSize > 5) {
      throw new Error('The size of the board should be at most 5.');
    }

    super({ players, boardSize });

    this.time = time;
    this._answered = false;
    this.strings = overwrite(JSON.parse(JSON.stringify(lightsUp)), strings);

    this.client = null;
    this.source = null;
    this._board = [];
    this.boardMessage = null;
    this.controllerMessage = null;
  }

  async initialize(source) {
    for (let i = 0; i < this.boardSize; i++) {
      this._board.push([]);
      for (let j = 0; j < this.boardSize; j++) {
        this._board[i].push(new MessageButton()
          .setCustomId(`${this.name}_${i}_${j}`)
          .setLabel('\u200b')
          .setStyle("PRIMARY")
        );
      }
    }

    super.initialize();

    this.source = source;
    this.client = source?.client;
    if (source.constructor.name === CommandInteraction.name) {
      if (!source.deferred) {
        await source.deferReply();
      }

      this.boardMessage = await source.editReply({ content: '\u200b', components: this.lightButtons });
      this.controllerMessage = await source.followUp({ content: '\u200b', components: this.controller });
    }
    else if (source.constructor.name === Message.name) {
      this.boardMessage = await source.channel.send({ content: '\u200b', components: this.lightButtons });
      this.controllerMessage = await this.boardMessage.reply({ content: '\u200b', components: this.controller });
    }
    else {
      throw new Error('The source is neither an instance of CommandInteraction nor an instance of Message.');
    }
  }

  _filter = async interaction => {
    if (interaction.user.id !== this.playerHandler.nowPlayer.id) return false;
    return interaction.customId.startsWith(this.name);
  }

  async start(channel) {
    if (this.win()) {
      this.end("JACKPOT");
      return;
    }

    while (!this.ended && this.playerHandler.alive) {
      const result = await Promise.race([
        sleep(this.time, { customId: `${this.name}_idle` }),
        this.boardMessage.awaitMessageComponent({ filter: this._filter, componentType: "BUTTON" }),
        this.controllerMessage.awaitMessageComponent({ filter: this._filter, componentType: "BUTTON" })
      ]);
      const player = this.playerHandler.nowPlayer;
      const [, arg1, arg2] = result.customId.split('_');

      let content = '';
      if (arg1 === 'stop') {
        await result.update({});

        player.status.set("LEAVING");
        this.playerHandler.next();
      }
      else if (arg1 === 'answer') {
        await result.reply({ content: format(this.strings.currentAnswer, this.answerContent), ephemeral: true });

        player.status.set("PLAYING");
      }
      else if (arg1 === 'idle') {
        player.status.set("IDLE");
        this.playerHandler.next();
      }
      else {
        player.status.set("PLAYING");
        player.addStep();

        this.flip(parseInt(arg1, 10), parseInt(arg2, 10));

        if (this.win()) {
          player.status.set("WINNER");
          this.winner = player;
          this.end("WIN");
        }
        else {
          this.playerHandler.next();
        }

        await result.update({ components: this.lightButtons }).catch(() => {
          this.end("DELETED");
        });
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

  flip(row, col) {
    super.flip(row, col);

    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
      const nr = row + dr, nc = col + dc;
      if (0 <= nr && nr < this.boardSize && 0 <= nc && nc < this.boardSize) {
        this._board[nr][nc].setStyle(this.lights[nr][nc] ? "PRIMARY" : "SECONDARY");
      }
    });
  }

  end(reason) {
    super.end(reason);

    this._board.forEach(row => {
      row.forEach(button => {
        button.setDisabled(true);
      })
    });
  }

  async conclude() {
    if (!this.ended) {
      throw new Error('The game has not ended.');
    }

    const message = this.strings.endMessage;

    let content;
    switch (this.endReason) {
      case "JACKPOT":
        content = format(message.jackpot, `<@${this.winner.id}>`);
        break;
      case "WIN":
        content = format(this._answered ? message.win.answered : message.win.unanswered, `<@${this.winner.id}>`);
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

    await this.boardMessage.edit({ components: this.lightButtons });
    await this.controllerMessage.delete();

    if ([CommandInteraction.name, Message.name].includes(this.source.constructor.name)) {
      await this.boardMessage.reply({ content, embeds });
    }
    else {
      throw new Error('The source is neither an instance of CommandInteraction nor an instance of Message.');
    }
  }

  get lightButtons() {
    const actionRows = [];
    for (let i = 0; i < this.boardSize; i++) {
      actionRows.push(new MessageActionRow());
      for (let j = 0; j < this.boardSize; j++) {
        actionRows[i].addComponents(this._board[i][j]);
      }
    }
    return actionRows;
  }

  get controller() {
    return [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(`${this.name}_answer`)
          .setLabel(this.strings.controller.answer)
          .setStyle("SUCCESS")
      ).addComponents(
        new MessageButton()
          .setCustomId(`${this.name}_stop`)
          .setLabel(this.strings.controller.stop)
          .setStyle("DANGER")
      )
    ];
  }

  get answerContent() {
    this._answered = true;
    let content = '';
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++)
        content += this.answer[i][j] ? '🟡' : '🔴';
      content += '\n';
    }
    return content;
  }
}

module.exports = DCLightsUp;
