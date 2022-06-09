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

  DCBullsAndCows: require('./djsgames/DCBullsAndCows.js'),
  DCGomoku: require('./djsgames/DCGomoku.js'),
  DCFinalCode: require('./djsgames/DCFinalCode.js'),
  DCFlipTrip: require('./djsgames/DCFlipTrip.js'),
  DCLightsUp: require('./djsgames/DCLightsUp.js'),
  DCTicTacToe: require('./djsgames/DCTicTacToe.js'),

  GameUtil: require('./util/GameUtil.js')
};
