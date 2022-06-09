const StatusManager = require('./StatusManager.js');

class PlayerStatusManager extends StatusManager {
  constructor(...status) {
    super("PLAYING", "BOT", "IDLE", "LEAVING", ...status);
  }

  set(status) {
    if (status === "BOT") {
      throw new Error('You cannot set a bot\'s status.');
    }

    super.set(status);
  }
}

module.exports = PlayerStatusManager;
