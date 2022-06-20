import { CommandInteraction, Message, MessageActionRow } from 'discord.js';
import { Range } from '../struct/Range';



// basic structure options

export interface PlayerOptions {
  id: number | string, 
  bot?: boolean, 
  symbol?: string | null, 
  username?: string
}

export interface PlayerManagerOptions {
  players: PlayerOptions[], 
  playerCountRange?: Range, 
  requireSymbol?: boolean, 
  firstPlayerIndex?: number
}

export interface GameOptions {
  playerManagerOptions: PlayerManagerOptions, 
  gameStatus?: string[]
}

export interface DjsGameOptions extends GameOptions {
  source: CommandInteraction | Message, 
  time: number
}



// implemented game options

export interface BullsAndCowsOptions {
  players: PlayerOptions[], 
  hardMode?: boolean, 
  answerLength?: number
}

export interface LightsUpOptions {
  players: PlayerOptions[], 
  boardSize: number
}

export interface FinalCodeOptions {
  players: PlayerOptions[], 
  range: Range
}



// implemented discord.js game options

export interface DjsBullsAndCowsOptions extends DjsGameOptions, BullsAndCowsOptions {
  strings: BullsAndCowsStrings
}

export interface DjsLightsUpOptions extends DjsGameOptions, LightsUpOptions {
  strings: LightsUpStrings
}

export interface DjsFinalCodeOptions extends DjsGameOptions, FinalCodeOptions {
  strings: FinalCodeStrings
}



// interfaces to implement

export interface BullsAndCowsInterface {
  answer: number[], 
  answerLength: number, 
  numberCount: number, 
  hardMode: boolean, 
  guess(query: number[]): BullsAndCowsResult, 
  win(result: BullsAndCowsResult): boolean
}

export interface LightsUpInterface {
  answer: boolean[][], 
  board: boolean[][], 
  boardSize: number, 
  flip(row: number, col: number): void, 
  win(): boolean
}

export interface FinalCodeInterface {
  answer: number, 
  range: Range, 
  guess(query: number): 1 | 0 | -1, 
  win(): boolean
}



// function returned results

export interface DjsInputResult {
  components: MessageActionRow[], 
  content: string, 
  endStatus: string
}

export interface BullsAndCowsResult {
  a: number, 
  b: number
}



// strings

export interface GameStrings {
  name: string,
  controller: ControllerStrings,
  endMessages: EndMessageStrings
}

export interface ControllerStrings {
  stop: string
}

export interface EndMessageStrings {
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

export interface BullsAndCowsStrings extends GameStrings {
  initial: string, 
  query: string
}

export interface LightsUpStrings extends GameStrings {
  answerSymbols: string[], 
  currentAnswer: string, 
  controller: LightsUpConstollerStrings
  endMessages: LightsUpEndMessageStrings
}

export interface LightsUpConstollerStrings extends ControllerStrings {
  answer: string
}

export interface LightsUpEndMessageStrings extends EndMessageStrings {
  jackpot: string, 
  unansweredWin: string
}

export interface FinalCodeStrings extends GameStrings {
  previous: FinalCodePreviousStrings, 
  interval: string, 
  nowPlayer: string
}

export interface FinalCodePreviousStrings {
  tooSmall: string, 
  tooLarge: string, 
  idle: string, 
  leaving: string
}