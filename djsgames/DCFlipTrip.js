const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const FlipTrip = require('../games/FlipTrip.js');
const { createEndEmbed, getInput } = require('../util/DjsUtil.js');
const { format, overwrite } = require('../util/Functions.js');
const { flipTrip } = require('../util/strings.json');

const MAX_BUTTON_PER_ROW = 5;

class DCFlipTrip extends FlipTrip {
  constructor({ players, boardSize, time, strings }) {
    super({ players, boardSize });

    this.time = time;
    this.strings = overwrite(JSON.parse(JSON.stringify(flipTrip)), strings);

    this.client = null;
    this.source = null;
    this.mainMessage = null;

    this._board = [];
    this._controller = null;
    this._inputMode = 0b100;
  }

  async initialize(source) {
    for (let i = 0; i < this.boardSize; i++) {
      if (i % MAX_BUTTON_PER_ROW === 0) {
        this._board.push(new MessageActionRow());
      }

      this._board[~~(i / MAX_BUTTON_PER_ROW)].addComponents(
        new MessageButton()
          .setCustomId(`game_${this.boardSize - 1 - i}`)
          .setLabel(`${this.boardSize - i}`)
          .setStyle("PRIMARY")
      );
    }
    this._controller = new MessageActionRow().addComponents(
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

      this.mainMessage = await source.editReply({ content: this.boardContent, components: [...this._board, this._controller] });
    }
    else if (source.constructor.name === Message.name) {
      this.mainMessage = await source.channel.send({ content: this.boardContent, components: [...this._board, this._controller] });
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
    }
    else {
      await input.update({});
      nowPlayer.status.set("PLAYING");
      nowPlayer.addStep();

      const [, ...args] = input.customId.split('_').map(a => parseInt(a, 10));
      const legal = this.flip(args[0]);

      if (!legal) {
        this.loser = nowPlayer;
        endStatus = "LOSE";
      }
      else if (this.win()) {
        this.winner = nowPlayer;
        endStatus = "WIN";
      }
    }

    this.playerManager.next();
    await this.mainMessage.edit({ content: this.boardContent }).catch(() => {
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
        content = format(message.win, { player: `<@${this.winner.id}>`, size: this.boardSize });
        break;
      case "LOSE":
        content = format(message.lose, { player: `<@${this.loser.id}>`, state: this.checks, perm: this._permutationCount - this.playerManager.totalSteps });
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


  get boardContent() {
    let boardContent = '';
    for (let i = this.boardSize - 1; i >= 0; i--) {
      boardContent += this.strings.numbers[i];
    }
    boardContent += '\n';
    boardContent += this.checks;

    return boardContent;
  }

  get checks() {
    let result = '';
    for (let i = this.boardSize - 1; i >= 0; i--) {
      result += this.strings.checks[(this.state & (1 << i)) ? 1 : 0];
    }
    return result;
  }
}

module.exports = DCFlipTrip;
