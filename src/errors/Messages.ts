import { ErrorCodes } from './ErrorCodes';

export const Messages = {
  [ErrorCodes.GameAlreadyEnded]: `The game has already ended.`, 
  [ErrorCodes.GameAlreadyInitialized]: `The game has already been initialized.`, 
  [ErrorCodes.GameNotEnded]: `The game has not ended yet.`, 
  [ErrorCodes.GameNotInitialized]: `The game has not been initialized yet.`, 

  [ErrorCodes.DuplicatedIds]: `Duplicated ids are not allowed.`, 
  [ErrorCodes.DuplicatedSymbols]: `Duplicated symbols are not allowed.`, 
  [ErrorCodes.HumanRequired]: `At least one human is required in this game.`, 
  [ErrorCodes.SymbolRequired]: `Each player must have a symbol.`, 
  
  [ErrorCodes.StatusNotFound]: (...args: any[]) => `Status ${args[0]} does not exist in the status manager.`, 
  [ErrorCodes.StatusSetFromBot]: `The bot's status cannot be modified.`, 
  [ErrorCodes.StatusSetToBot]: `The player's status cannot be set to BOT.`, 

  [ErrorCodes.GridFilled]: (...args: any[]) => `Trying to fill location (${args[0]}, ${args[1]}) which is already filled in.`, 
  [ErrorCodes.InvalidRangeLength]: (...args: any[]) => `Interval (${args[0]}, ${args[1]}) is invalid.`, 
  [ErrorCodes.OutOfRange]: (...args: any[]) => `${args[0]} must be${args[1] === args[2] ? ` ${args[1]}` : `${typeof args[1] === 'number' && args[1] !== -Infinity ? ` greater than or equal to ${args[1]}` : ``}${typeof args[1] === 'number' && typeof args[2] === 'number' && args[1] !== -Infinity && args[2] !== Infinity ? ` and` : ``}${typeof args[2] === 'number' && args[2] !== Infinity ? ` less than or equal to ${args[2]}` : ``}`}.`, 

  [ErrorCodes.BigTwoTrickNotPlayable]: `A player is trying to play an invalid trick.`, 

  [ErrorCodes.BullsAndCowsQueryLength]: (...args: any[]) => `The number count in query ${args[0]} is different from the answer's length (${args[1]}).`, 
  [ErrorCodes.BullsAndCowsDuplicatedNumbers]: (...args: any[]) => `There are duplicated numbers in query ${args[0]}.`, 

  [ErrorCodes.FinalCodeQueryType]: `The query must be an integer.`, 

  [ErrorCodes.BotsNotAllowed]: `Bots are not allowed in this game.`, 
  [ErrorCodes.GuildNotCached]: `The guild is not cached.`, 
  [ErrorCodes.InvalidButtonInteraction]: `Invalid ButtonInteraction is received.`, 
  [ErrorCodes.InvalidChannel]: `The channel of the source is invalid.`, 
  [ErrorCodes.InvalidMainMessage]: `The main message of the game is invalid.`, 

  [ErrorCodes.OneHumanOnly]: `There must be one and only one human in this game.`
};