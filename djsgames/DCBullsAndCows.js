const { MessageActionRow, MessageButton } = require('discord.js');
const BullsAndCows = require('../games/BullsAndCows.js');
const { PlayerStatus } = require('../util/Constants.js');
const { fixedDigits, format, overwrite } = require('../util/Functions.js');
const { bullsAndCows } = require('../util/strings.json');

class DCBullsAndCows extends BullsAndCows {
  constructor({ players, hardmode, answerLength, numberCount, time, strings }) {
    super({ players, hardmode, answerLength, numberCount });

    this.time = time;

    this.strings = overwrite(JSON.parse(JSON.stringify(bullsAndCows)), strings);

    this.content = '';
    this.boardMessage = null;
  }

  async initialize(interaction) {
    if (!interaction.deferred)
      throw new Error('The interaction is not deffered.');

    super.initialize();

    this.content = format(this.strings.firstMessage, this.playerHandler.nowPlayer.username);
    this.boardMessage = await interaction.editReply({ content: this.content, components: this.components });
  }

  // 篩選
  _messageFilter = async message => {
    if (message.author.id !== this.playerHandler.nowPlayer.id) return false;
    return isValid(message.content);
  }

  _buttonFilter = async interaction => {
    if (interaction.user.id !== this.playerHandler.nowPlayer.id) return false;
    return interaction.customId.startsWith(this.name);
  }

  // 開始遊戲
  async start(channel) {
    while (this.playerHandler.alive) {
      const result = await Promise.race([
        channel.awaitMessages({ filter: this._messageFilter, time: this.time, max: 1 }),
        this.boardMessage.awaitMessageComponent({ filter: this._buttonFilter, time: this.time, componentType: "BUTTON" })
      ]);
      const player = this.playerHandler.nowPlayer;

      if (result.customId === `${this.name}_stop`) {
        player.setStop();
        continue;
      }

      if (!result.size) {
        player.setIdle();
        continue;
      }

      player.setPlay();
      player.addStep();

      const message = result.first();
      await message.delete().catch(() => {});
      const query = getQuery(message.content);
      const status = this.guess(query);

      if (this.hardmode) {
        const content = this.boardMessage.content + '\n' + format(this.strings.queryResponse, status.a, status.b, message.content);
        await this.boardMessage.edit({ content });
      }
      else {
        this.content += '\n' + format(this.strings.queryResponse, status.a, status.b, message.content);
        await this.boardMessage.edit({ content: this.content });
      }

      if (this.win(status)) {
        player.setWinner();
        this.winner = player;
        continue;
      }

      this.playerHandler.next();
    }

    switch (this.playerHandler.nowPlayer.status) {
      case PlayerStatus.WINNER:
        this.end("WIN");
        break;
      case PlayerStatus.IDLE:
        this.end("IDLE");
        break;
      case PlayerStatus.STOP:
        this.end("STOP");
        break;
    }
  }

  async conclude(interaction) {
    if (!this.ended) {
      throw new Error('The game has not ended.');
    }

    let mainContent;
    switch (this.endReason) {
      case "WIN":
        mainContent = format(this.strings.endMessage.win, this.winner.username, this.answer.join(''));
        break;
      case "IDLE":
        mainContent = format(this.strings.endMessage.idle, this.playerHandler.usernames.join(' '));
        break;
      case "STOP":
        mainContent = format(this.strings.endMessage.stopped, this.playerHandler.usernames.join(' '));
        break;
    }

    const min = ~~(this.duration/60000);
    const sec = Math.round(this.duration/1000) % 60;
    mainContent += format(this.strings.endMessage.trail, min, fixedDigits(sec, 2), this.playerHandler.totalSteps);

    await interaction.editReply({ components: [] });
    await interaction.followUp(mainContent);
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

const isValid = (number) => {
  if (!/\d{4}/.test(number)) return false;
  const query = getQuery(number);
  return (new Set(query)).size === number.length;
}

const getQuery = (number) => {
  const query = [];
  for (let c of number) {
    query.push(+c);
  }
  return query;
}

module.exports = DCBullsAndCows;
