const { CommandInteraction, Message, MessageActionRow, MessageButton } = require('discord.js');
const FlipTrip = require('../games/FlipTrip.js');
const { createEndEmbed, format, overwrite, sleep } = require('../util/Functions.js');
const { flipTrip } = require('../util/strings.json');

const MAX_BUTTON_PER_ROW = 5;

class DCFlipTrip extends FlipTrip {
  constructor({ players, boardSize, time, strings }) {
    super({ players, boardSize });

    this.time = time;
    this.strings = overwrite(JSON.parse(JSON.stringify(flipTrip)), strings);

    this.client = null;
    this.source = null;
    this.boardMessage = null;
    this.controller = null;
  }

  async initialize(source) {
    this.controller = [];
    for (let i = 0; i < this.boardSize; i++) {
      if (i % MAX_BUTTON_PER_ROW === 0) {
        this.controller.push(new MessageActionRow());
      }

      this.controller[~~(i / MAX_BUTTON_PER_ROW)].addComponents(
        new MessageButton()
          .setCustomId(`${this.name}_${this.boardSize - 1 - i}`)
          .setLabel(`${this.boardSize - i}`)
          .setStyle("PRIMARY")
      );
    }
    this.controller.push(new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`${this.name}_stop`)
        .setLabel(this.strings.stopButtonMessage)
        .setStyle("DANGER")
    ));

    super.initialize();

    this.source = source;
    this.client = source?.client;
    if (source.constructor.name === CommandInteraction.name) {
      if (!source.deferred) {
        await source.deferReply();
      }

      this.boardMessage = await source.editReply({ content: this.board, components: this.controller });
    }
    else if (source.constructor.name === Message.name) {
      this.boardMessage = await source.channel.send({ content: this.board, components: this.controller });
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
        this.boardMessage.awaitMessageComponent({ filter: this._filter, componentType: "BUTTON" })
      ]);
      const player = this.playerHandler.nowPlayer;
      const [, arg1] = result.customId.split('_');

      if (arg1 === 'stop') {
        await result.update({});

        player.status.set("LEAVING");
        this.playerHandler.next();
      }
      else if (arg1 === 'idle') {
        player.status.set("IDLE");
        this.playerHandler.next();
      }
      else {
        player.status.set("PLAYING");
        player.addStep();

        const legal = this.flip(parseInt(arg1, 10));

        if (!legal) {
          this.loser = player;
          this.end("LOSE");
        }
        if (this.win()) {
          this.winner = player;
          this.end("WIN");
        }
        else {
          this.playerHandler.next();
        }

        await result.update(this.board).catch(() => {
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

  async end(reason) {
    super.end(reason);

    await this.boardMessage.edit({ components: [] }).catch(() => {});
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
    if ([CommandInteraction.name, Message.name].includes(this.source.constructor.name)) {
      await this.boardMessage.reply({ content, embeds }).catch(() => {
        this.source.channel.send({ content, embeds });
      });
    }
    else {
      throw new Error('The source is neither an instance of CommandInteraction nor an instance of Message.');
    }
  }


  get board() {
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
