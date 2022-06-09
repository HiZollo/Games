const StatusManager = require('./StatusManager.js');

class GameStatusManager extends StatusManager {
  constructor(...status) {
    super("ONGOING", "WIN", "DRAW", "LOSE", "STOPPED", "IDLE", "DELETED", ...status);
  }
}

module.exports = GameStatusManager;
