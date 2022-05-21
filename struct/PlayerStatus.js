const Status = require('./Status.js');

class PlayerStatus extends Status {
  constructor(...status) {
    super("PLAYING", "BOT", "IDLE", "LEAVING", "WINNER", "DRAW", "LOSER", ...status);
  }

  set(status) {
    if (status === "BOT") {
      throw new Error('You cannot set a bot\'s status.');
    }

    super.set(status);
  }
}

module.exports = PlayerStatus;
