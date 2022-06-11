module.exports = {
  Game: require('./struct/Game.js'),
  Player: require('./struct/Player.js'),
  PlayerManager: require('./struct/PlayerManager.js'),
  Status: require('./struct/StatusManager.js'),
  GameStatus: require('./struct/GameStatusManager.js'),
  PlayerStatus: require('./struct/PlayerStatusManager.js'),

  BullsAndCows: require('./games/BullsAndCows.js'),
  Gomoku: require('./games/Gomoku.js'),
  FinalCode: require('./games/FinalCode.js'),
  FlipTrip: require('./games/FlipTrip.js'),
  LightsUp: require('./games/LightsUp.js'),
  TicTacToe: require('./games/TicTacToe.js'),

  DjsBullsAndCows: require('./djsgames/DjsBullsAndCows.js'),
  DjsGomoku: require('./djsgames/DjsGomoku.js'),
  DjsFinalCode: require('./djsgames/DjsFinalCode.js'),
  DjsFlipTrip: require('./djsgames/DjsFlipTrip.js'),
  DjsLightsUp: require('./djsgames/DjsLightsUp.js'),
  DjsTicTacToe: require('./djsgames/DjsTicTacToe.js'),

  GameUtil: require('./util/GameUtil.js')
};
