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
  boardSize?: number
}

export interface GomokuOptions {
  players: PlayerOptions[], 
  boardSize?: number
}

export interface LightsUpOptions {
  players: PlayerOptions[], 
  boardSize?: number
}

export interface TicTacToeOptions {
  players: PlayerOptions[], 
  boardSize?: number
}

export interface TofeOptions {
  players: PlayerOptions[], 
  hardMode?: boolean
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

export interface BullsAndCowsResult {
  a: number, 
  b: number
}
