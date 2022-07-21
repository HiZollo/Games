import { ActionRowBuilder, CommandInteraction, Message, MessageActionRowComponentBuilder } from 'discord.js';
import { TofeDirections } from './';
import { Range } from '../struct';



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

export interface StatusManagerOptions {
  initial?: string, 
  status: string[]
}


// implemented game options

export interface BigTwoOptions {
  players: PlayerOptions[] 
}

export interface BullsAndCowsOptions {
  players: PlayerOptions[], 
  answerLength?: number
}

export interface FinalCodeOptions {
  players: PlayerOptions[], 
  range?: Range
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

export interface TofeOptions {
  players: PlayerOptions[], 
  hardMode: boolean
}



// implemented discord.js game options

export interface DjsGameWrapperOptions {
  source: CommandInteraction | Message, 
  time: number
}

export interface DjsGameInitializeMessageOptions {
  content: string, 
  components: ActionRowBuilder<MessageActionRowComponentBuilder>[]
}

export interface DjsBigTwoOptions extends DjsGameWrapperOptions, BigTwoOptions {
  strings: BigTwoStrings
}

export interface DjsBullsAndCowsOptions extends DjsGameWrapperOptions, BullsAndCowsOptions {
  hardMode: boolean, 
  strings: BullsAndCowsStrings
}

export interface DjsFinalCodeOptions extends DjsGameWrapperOptions, FinalCodeOptions {
  strings: FinalCodeStrings
}

export interface DjsFlipTripOptions extends DjsGameWrapperOptions, FlipTripOptions {
  strings: FlipTripStrings
}

export interface DjsGomokuOptions extends DjsGameWrapperOptions, GomokuOptions {
  strings: GomokuStrings
}

export interface DjsLightsUpOptions extends DjsGameWrapperOptions, LightsUpOptions {
  strings: LightsUpStrings
}

export interface DjsTicTacToeOptions extends DjsGameWrapperOptions, LightsUpOptions {
  strings: TicTacToeStrings
}

export interface DjsTofeOptions extends DjsGameWrapperOptions, TofeOptions {
  strings: TofeStrings
}



// interfaces to implement

export interface IBigTwo {
  cards: number[][], 
  currentCards: number[], 
  play(cards: number[]): void, 
  win(): boolean
}

export interface IBullsAndCows {
  answer: number[], 
  answerLength: number, 
  numberCount: number, 
  guess(query: number[]): BullsAndCowsResult, 
  win(result: BullsAndCowsResult): boolean
}

export interface IFinalCode {
  answer: number, 
  range: Range, 
  guess(query: number): 1 | 0 | -1, 
  win(): boolean
}

export interface IFlipTrip {
  boardSize: number, 
  state: number,
  flip(location: number): boolean, 
  win(): boolean
}

export interface IGomoku {
  board: (string | null)[][], 
  boardSize: number, 
  fill(row: number, col: number): void, 
  win(row: number, col: number): (string | null), 
  draw(): boolean
}

export interface ILightsUp {
  answer: boolean[][], 
  board: boolean[][], 
  boardSize: number, 
  flip(row: number, col: number): void, 
  win(): boolean
}

export interface ITicTacToe {
  board: (string | null)[][], 
  boardSize: number, 
  fill(row: number, col: number): void, 
  win(row: number, col: number): (string | null), 
  draw(): boolean
}

export interface ITofe {
  board: (number | null)[][], 
  boardSize: number, 
  score: number, 
  hardMode?: boolean, 
  operate(direction: TofeDirections): boolean, 
  win(): boolean
}



// function returned results

export interface DjsInputResult {
  components?: ActionRowBuilder<MessageActionRowComponentBuilder>[], 
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
  playerLeft: string,
  controller: ControllerStrings,
  endMessages: EndMessageStrings
}

export interface BigTwoStrings extends GameStrings {
  ranks: string[], 
  suits: string[], 
  player: BigTwoPlayerStrings, 
  previous: BigTwoPreviousStrings, 
  tricks: BigTwoTrickStrings, 
  hbar: string, 
  nowPlayer: string, 
  cardsOnTable: string, 
  cardsLeft: string, 
  openCards: string, 
  controller: BigTwoControllerStrings
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

export interface FlipTripStrings extends GameStrings {
  numbers: string[], 
  pieces: string[], 
  endMessages: FlipTripEndMessageStrings
}

export interface GomokuStrings extends GameStrings {
  rows: string[], 
  columns: string[], 
  grid: string, 
  corner: string, 
  previous: GomokuPreviousStrings, 
  nowPlayer: string, 
  endMessages: GomokuEndMessageStrings
}

export interface LightsUpStrings extends GameStrings {
  answerSymbols: string[], 
  currentAnswer: string, 
  controller: LightsUpControllerStrings
  endMessages: LightsUpEndMessageStrings
}

export interface TicTacToeStrings extends GameStrings {
  labels: string[][], 
  previous: TicTacToePreviousStrings, 
  nowPlayer: string, 
  endMessages: TicTacToeEndMessageStrings
}

export interface TofeStrings extends GameStrings {
  score: string, 
  controller: TofeControllerStrings, 
  endMessages: TofeEndMessageStrings
}


export interface ControllerStrings {
  leave: string
}

export interface BigTwoControllerStrings extends ControllerStrings {
  cards: string
}

export interface LightsUpControllerStrings extends ControllerStrings {
  answer: string
}

export interface TofeControllerStrings extends ControllerStrings {
  up: string, 
  down: string, 
  left: string, 
  right: string
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

export interface FlipTripEndMessageStrings extends EndMessageStrings {
  lose: string
}

export interface GomokuEndMessageStrings extends EndMessageStrings {
  draw: string
}

export interface LightsUpEndMessageStrings extends EndMessageStrings {
  jackpot: string, 
  unansweredWin: string
}

export interface TicTacToeEndMessageStrings extends EndMessageStrings {
  draw: string
}

export interface TofeEndMessageStrings extends EndMessageStrings {
  lose: string
}


export interface BigTwoPreviousStrings {
  play: string, 
  pass: string, 
  idle: string
}

export interface FinalCodePreviousStrings {
  tooSmall: string, 
  tooLarge: string, 
  idle: string
}

export interface GomokuPreviousStrings {
  move: string, 
  idle: string
}

export interface TicTacToePreviousStrings {
  idle: string
}


export interface BigTwoPlayerStrings {
  cards: string, 
  menu: string, 
  pass: string, 
  play: string, 
  selected: string, 
  played: string, 
  passed: string, 
  invalid: string, 
  notYourTurn: string, 
  noSelection: string
}

export interface BigTwoTrickStrings {
  none: string, 
  single: string, 
  pair: string, 
  straight: string, 
  fullHouse: string, 
  fourOfAKind: string, 
  straightFlush: string
}