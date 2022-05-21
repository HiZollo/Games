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

    this._board = []
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
        .setLabel(this.strings.stopButtonMessage)
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
    return interaction.user.id === this.playerHandler.nowPlayer.id;
  }

  async start() {
    let nowPlayer;
    while (!this.ended && this.playerHandler.alive) {
      nowPlayer = this.playerHandler.nowPlayer;
      const input = await getInput(this);

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
          nowPlayer.status.set("LOSER");
        }
        else if (this.win()) {
          this.winner = nowPlayer;
          nowPlayer.status.set("WINNER");
        }
      }

      this.playerHandler.next();
      await this.mainMessage.edit({ content: this.boardContent }).catch(() => {
        this.end("DELETED");
      });
    }

    switch (nowPlayer.status.now) {
      case "WINNER":
        this.end("WIN");
        break;
      case "LOSER":
        this.end("LOSE");
        break;
      case "IDLE":
        this.end("IDLE");
        break;
      case "LEAVING":
        this.end("STOPPED");
        break;
    }
  }

  async end(reason) {
    super.end(reason);

    await this.mainMessage.edit({ components: [] }).catch(() => {});
  }

  async conclude() {
    if (!this.ended) {
      throw new Error('The game has not ended.');
    }

    const message = this.strings.endMessage;
    let content;
    switch (this.endReason) {
      case "WIN":
        content = format(message.win, `<@${this.winner.id}>`, this.boardSize);
        break;
      case "LOSE":
        content = format(message.lose, `<@${this.loser.id}>`, this.checks, this._permutationCount - this.playerHandler.totalSteps);
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
