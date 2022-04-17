const BullsAndCows = require('../games/BullsAndCows.js');

class DCBullsAndCows extends BullsAndCows {
  constructor({ players, hardmode, answerLength, numberCount, time, strings }) {
    super({ players, hardmode, answerLength, numberCount });
    this.time = time;
    this.strings = strings;
  }

  async initialize(interaction) {
    if (!interaction.deferred)
      throw new Error('The interaction is not deffered.');

    super.initialize();

    await interaction.editReply(`${interaction.user}，請猜測一個數字${this.hardmode ? '\n此為**困難模式**，你的提示回覆會在三秒後被刪除，請做好準備' : ''}`);
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

          await channel.send(`\`${message.content}\` 得出的結果是：\`${a}A${b}B\``);
        }
      }).catch(async (error) => {
        await this.end("IDLE");
      });
    }
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
