const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const LightsUp = require('../games/LightsUp.js');
const { createEndEmbed, getInput } = require('../util/DjsUtil.js');
const { format, overwrite } = require('../util/Functions.js');
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
    this.mainMessage = null;
    this.controllerMessage = null;

    this._board = [];
    this._controller = null;
    this._inputMode = 0b110;
  }

  async initialize(source) {
    for (let i = 0; i < this.boardSize; i++) {
      this._board.push([]);
      for (let j = 0; j < this.boardSize; j++) {
        this._board[i].push(new MessageButton()
          .setCustomId(`game_${i}_${j}`)
          .setLabel('\u200b')
          .setStyle("PRIMARY")
        );
      }
    }
    this._controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('ctrl_answer')
        .setLabel(this.strings.controller.answer)
        .setStyle("SUCCESS")
    ).addComponents(
      new MessageButton()
        .setCustomId('ctrl_stop')
        .setLabel(this.strings.controller.stop)
        .setStyle("DANGER")
    );

    super.initialize();

    this.source = source;
    this.client = source?.client;
    if (source.constructor.name === CommandInteraction.name) {
      if (!source.deferred) {
        await source.deferReply();
      }

      this.mainMessage = await source.editReply({ content: '\u200b', components: this.components });
      this.controllerMessage = await source.followUp({ content: '\u200b', components: [this._controller] });
    }
    else if (source.constructor.name === Message.name) {
      this.mainMessage = await source.channel.send({ content: '\u200b', components: this.components });
      this.controllerMessage = await this.mainMessage.reply({ content: '\u200b', components: [this._controller] });
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

    if (input === null) {
      nowPlayer.status.set("IDLE");
    }
    else if (input.customId?.startsWith('ctrl_')) {
      const [, ...args] = input.customId.split('_');

      if (args[0] === 'stop') {
        await input.update({});
        nowPlayer.status.set("LEAVING");
      }
      else if (args[0] === 'answer') {
        await input.reply({ content: format(this.strings.currentAnswer, this.answerContent), ephemeral: true });
        nowPlayer.status.set("PLAYING");
      }
    }
    else {
      await input.update({});
      nowPlayer.status.set("PLAYING");
      nowPlayer.addStep();

      const [, ...args] = input.customId.split('_').map(a => parseInt(a, 10));
      this.flip(args[0], args[1]);

      if (this.win()) {
        this.winner = nowPlayer;
        endStatus = "WIN";
      }
    }

    this.playerManager.next();
    await this.mainMessage.edit({ components: this.components }).catch(() => {
      this.end("DELETED");
    });

    if (endStatus) {
      this.end(endStatus);
    }
  }

  async start(channel) {
    if (this.win()) {
      this.end("JACKPOT");
      return;
    }

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

  flip(row, col) {
    super.flip(row, col);

    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
      const nr = row + dr, nc = col + dc;
      if (0 <= nr && nr < this.boardSize && 0 <= nc && nc < this.boardSize) {
        this._board[nr][nc].setStyle(this.lights[nr][nc] ? "PRIMARY" : "SECONDARY");
      }
    });
  }

  async end(status) {
    super.end(status);

    this._board.forEach(row => {
      row.forEach(button => {
        button.setDisabled(true);
      })
    });
    await this.mainMessage.edit({ components: this.components }).catch(() => {});
    await this.controllerMessage.delete().catch(() => {});
  }

  async conclude() {
    if (this.ongoing) {
      throw new Error('The game has not ended.');
    }

    const message = this.strings.endMessage;
    let content;
    switch (this.status.now) {
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
    return actionRows;
  }

  get answerContent() {
    this._answered = true;
    let content = '';
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++)
        content += this.strings.answer[this.answer[i][j] ? 1 : 0];
      content += '\n';
    }
    return content;
  }
}

module.exports = DCLightsUp;
