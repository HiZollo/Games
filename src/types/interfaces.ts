import { CommandInteraction, Message, MessageActionRow } from 'discord.js';
import { Range } from '../struct/Range';

export interface GameOptions {
  playerManagerOptions: PlayerManagerOptions, 
  gameStatus?: string[]
}

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

export interface BullsAndCowsOptions {
  players: PlayerOptions[], 
  hardMode?: boolean, 
  answerLength?: number
}

/**
 * @property `a` the number of a's
 * @property `b` the number of b's
 */
export interface BullsAndCowsResult {
  a: number, 
  b: number
}

export interface DjsGameOptions extends GameOptions {
  source: CommandInteraction | Message, 
  time: number
}

export interface DjsBullsAndCowsOptions extends DjsGameOptions, BullsAndCowsOptions {
  strings: string
}

export interface BullsAndCowsInterface {
  answer: number[], 
  answerLength: number, 
  numberCount: number, 
  hardMode: boolean, 
  win(result: BullsAndCowsResult): boolean, 
  guess(query: number[]): BullsAndCowsResult
}

export interface DjsInputResult {
  components: MessageActionRow[], 
  content: string, 
  endStatus: string
}