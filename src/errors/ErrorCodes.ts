export enum ErrorCodes {
  GameAlreadyInitialized, 
  GameAlreadyEnded, 
  GameNotEnded, 

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