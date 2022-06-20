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

export interface FinalCodeOptions {
  players: PlayerOptions[], 
  range: Range
}

export interface FlipTripOptions {
  players: PlayerOptions[], 
  boardSize: number
}

export interface GomokuOptions {
  players: PlayerOptions[], 
  boardSize: number
}

export interface LightsUpOptions {
  players: PlayerOptions[], 
  boardSize: number
}

export interface TicTacToeOptions {
  players: PlayerOptions[], 
  boardSize: number
}



// implemented discord.js game options

export interface DjsBullsAndCowsOptions extends DjsGameOptions, BullsAndCowsOptions {
  strings: BullsAndCowsStrings
}

export interface DjsFinalCodeOptions extends DjsGameOptions, FinalCodeOptions {
  strings: FinalCodeStrings
}

export interface DjsFlipTripOptions extends DjsGameOptions, FlipTripOptions {
  strings: FlipTripStrings
}

export interface DjsGomokuOptions extends DjsGameOptions, GomokuOptions {
  strings: GomokuStrings
}

export interface DjsLightsUpOptions extends DjsGameOptions, LightsUpOptions {
  strings: LightsUpStrings
}

export interface DjsTicTacToeOptions extends DjsGameOptions, LightsUpOptions {
  strings: TicTacToeStrings
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

export interface FinalCodeInterface {
  answer: number, 
  range: Range, 
  guess(query: number): 1 | 0 | -1, 
  win(): boolean
}

export interface FlipTripInterface {
  boardSize: number, 
  state: number,
  appearedStates: number[]
  flip(location: number): boolean, 
  win(): boolean
}

export interface GomokuInterface {
  board: (string | null)[][], 
  boardSize: number, 
  fill(row: number, col: number): void, 
  win(row: number, col: number): (string | null), 
  draw(): boolean
}

export interface LightsUpInterface {
  answer: boolean[][], 
  board: boolean[][], 
  boardSize: number, 
  flip(row: number, col: number): void, 
  win(): boolean
}

export interface TicTacToeInterface {
  board: (string | null)[][], 
  boardSize: number, 
  fill(row: number, col: number): void, 
  win(row: number, col: number): (string | null), 
  draw(): boolean
}



// function returned results

export interface DjsInputResult {
  components?: MessageActionRow[], 
  content?: string, 
  endStatus?: string
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

export interface FlipTripStrings extends GameStrings {
  numbers: string[], 
  pieces: string[], 
  endMessages: FlipTripEndMessageStrings
}

export interface FlipTripEndMessageStrings extends EndMessageStrings {
  lose: string
}

export interface GomokuStrings extends GameStrings {
  rows: string[], 
  columns: string[], 
  grid: string, 
  corner: string, 
  previous: GomokuPreviousStrings, 
  nowPlayer: string, 
  endMessages: GomokuSEndMessageStrings
}

export interface GomokuPreviousStrings {
  move: string, 
  idle: string, 
  leaving: string
}

export interface GomokuSEndMessageStrings extends EndMessageStrings {
  draw: string
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

export interface TicTacToeStrings extends GameStrings {
  labels: string[][], 
  previous: TicTacToePreviousStrings, 
  nowPlayer: string, 
  endMessages: TicTacToeEndMessageStrings
}

export interface TicTacToePreviousStrings {
  idle: string, 
  leaving: string
}

export interface TicTacToeEndMessageStrings extends EndMessageStrings {
  draw: string
}