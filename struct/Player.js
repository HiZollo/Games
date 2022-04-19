const { PlayerStatus } = require('../util/Constants.js');

class Player {
  constructor({ username = 'Player', id, symbol = null, bot = false }) {
    if (id == null) {
      throw new Error('Player id should be specified');
    }

    this.username = username;
    this.id = id;
    this.symbol = symbol;
    this.steps = 0;
    this.status = bot ? PlayerStatus.BOT : PlayerStatus.PLAY;
  }

  addStep(step = 1) {
    this.steps += step;
  }

  setPlay() {
    this.status = PlayerStatus.PLAY;
  }

  setIdle() {
    this.status = PlayerStatus.IDLE;
  }

  setStop() {
    this.status = PlayerStatus.STOP;
  }

  setWinner() {
    this.status = PlayerStatus.WINNER;
  }
}

module.exports = Player;
