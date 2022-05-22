const Status = require('./Status.js');

class GameStatus extends Status {
  constructor(...status) {
    super("ONGOING", "WIN", "DRAW", "LOSE", "STOPPED", "IDLE", "DELETED", ...status);
  }
}

module.exports = GameStatus;
