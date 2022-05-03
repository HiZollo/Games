const PlayerStatus = require('./PlayerStatus.js');

class Player {
  constructor({ username = 'Player', id, symbol = null, bot = false }) {
    if (id == null) {
      throw new Error('Player id should be specified');
    }

    this.username = username;
    this.id = id;
    this.symbol = symbol;
    this.steps = 0;
    this.time = 0;
    this.status = new PlayerStatus();
  }

  addStep(step = 1) {
    this.steps += step;
  }
}

module.exports = Player;
