export enum ErrorCodes {
  GameAlreadyEnded, 
  GameAlreadyInitialized, 
  GameNotInitialized, 
  GameNotEnded, 

  DuplicatedIds, 
  DuplicatedSymbols, 
  HumanRequired, 
  SymbolRequired, 
  
  StatusNotFound, 
  StatusSetFromBot, 
  StatusSetToBot, 

  GridFilled, 
  InvalidRangeLength, 
  OutOfRange, 

  BigTwoTrickNotPlayable, 

  BullsAndCowsQueryLength, 
  BullsAndCowsDuplicatedNumbers, 

  ChessIllegalMove,

  FinalCodeQueryType, 

  OneHumanOnly
};