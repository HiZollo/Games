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

  FinalCodeQueryType, 

  BotsNotAllowed, 
  GuildNotCached, 
  InvalidButtonInteraction, 
  InvalidChannel, 
  InvalidMainMessage, 

  OneHumanOnly
};