const BullsAndCows = require('../games/BullsAndCows.js');
const { fixedDigits, format, overwrite } = require('../util/Functions.js');
const { bullsAndCows } = require('../util/strings.json');

class DCBullsAndCows extends BullsAndCows {
  constructor({ players, hardmode, answerLength, numberCount, time, strings }) {
    super({ players, hardmode, answerLength, numberCount });

    this.time = time;

    this.strings = overwrite(JSON.parse(JSON.stringify(bullsAndCows)), strings);

    this.boardMessage = null;
  }

  async initialize(interaction) {
    if (!interaction.deferred)
      throw new Error('The interaction is not deffered.');

    super.initialize();

    this.boardMessage = await interaction.editReply(format(this.strings.firstMessage, this.playerHandler.nowPlayer.username));
  }

  // 篩選
  _filter = async message => {
    if (message.author.id !== this.playerHandler.nowPlayer.id) return false;
    if (message.content.toLowerCase() === 'stop') return true;
    return isValid(message.content);
  }

  // 開始遊戲
  async start(channel) {
    while (!this.ended) {
      await channel.awaitMessages({ filter: this._filter, time: this.time, max: 1 }).then(async collected => {
        const message = collected.first();
        await message.delete().catch(() => {});

        if (message.content.toLowerCase() === 'stop')
          return this.end("STOPPED");
        else {
          const query = getQuery(message.content);
          const {a, b} = this.guess(query);
          this.playerHandler.nowPlayer.addStep();
          this.playerHandler.next();

          await channel.send(format(this.strings.queryResponse, this.playerHandler.nowPlayer.username, a, b, message.content));
        }
      }).catch(async (error) => {
        await this.end("IDLE");
      });
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
      case "STOPPED":
        mainContent = format(this.strings.endMessage.stopped, this.playerHandler.usernames.join(' '));
        break;
    }

    const min = ~~(this.duration/60000);
    const sec = Math.round(this.duration/1000) % 60;
    mainContent += format(this.strings.endMessage.trail, min, fixedDigits(sec, 2), this.playerHandler.totalSteps);
    await interaction.followUp(mainContent);
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
