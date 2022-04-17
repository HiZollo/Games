const { PlayerStatus } = require('../util/Constants.js');

class Player {
  constructor({ name = 'Player', id, symbol = null, bot = false }) {
    if (id == null) {
      throw new Error('Player id should be specified');
    }

    this.name = name;
    this.id = id;
    this.symbol = symbol;
    this.steps = 0;
    this.status = bot ? PlayerStatus.BOT : PlayerStatus.PLAYING;
  }

  addStep(step = 1) {
    this.steps += step;
  }

  setPlaying() {
    this.status = PlayerStatus.PLAYING;
  }

  setIdle() {
    this.status = PlayerStatus.IDLE;
  }

  setStop() {
    this.status = PlayerStatus.STOP;
  }

}

module.exports = Player;
