import { BullsAndCows } from '../games/BullsAndCows';

export type ImplementedGame = BullsAndCows

export type GameStrings = {
  name: string,
  controller: ControllerStrings,
  endMessages: EndMessageStrings
}

export type ControllerStrings = {
  stop: string
}

export type EndMessageStrings = {
  win: string,
  idle: string,
  stopped: string,
  deleted: string,
  gameStats: {
    header: string, 
    message: string
  }, 
  playerStats: {
    message: string
  }
}

export type BullsAndCowsStrings = GameStrings & {
  initial: string, 
  query: string
}