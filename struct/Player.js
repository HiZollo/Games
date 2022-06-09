const PlayerStatusManager = require('./PlayerStatusManager.js');

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
    this.status = new PlayerStatusManager();
  }

  addStep(step = 1) {
    this.steps += step;
  }

  addTime(time = 0) {
    this.time += time;
  }
}

module.exports = Player;
