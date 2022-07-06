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