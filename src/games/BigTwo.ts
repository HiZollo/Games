import { ErrorCodes, HZGError } from '../errors';
import { Game, Range } from '../struct';
import { BigTwoOptions, BigTwoTrick, BigTwoTrickType, IBigTwo } from '../types';
import { GameUtil } from '../util/GameUtil';

const CARD_COUNT = 52;

export class BigTwo extends Game implements IBigTwo {
  public currentCards: number[];
  public currentTrick: BigTwoTrick;
  public cards: number[][];
  public passCount: number;

  constructor({ players }: BigTwoOptions ) {
    super({ playerManagerOptions: { players, playerCountRange: new Range(4, 4) } });

    this.currentCards = [];
    this.currentTrick = [BigTwoTrickType.None, -1];
    this.cards = [[], [], [], []];
    this.passCount = 0;
  }

  initialize(): void {
    super.initialize();

    const cards = [];
    for (let i = 0; i < CARD_COUNT; i++)
      cards.push(i);
    GameUtil.shuffle(cards);

    for (let i = 0; i < CARD_COUNT; i++)
      this.cards[i & 3].push(cards[i]);
    
    this.cards.forEach(c => {
      c.sort((a, b) => a - b);
    });

    for (let i = 0; i < this.playerManager.playerCount; i++) {
      if (this.cards[i].includes(0)) {
        this.playerManager.index = i;
        break;
      }
    }
  }

  playable(cards: number[]): boolean {
    const trick = this.cardsToTrick(cards);
    if (trick[0] === BigTwoTrickType.None) return false;
    if (this.currentTrick[0] === BigTwoTrickType.None) return true;
    if (trick[0] !== this.currentTrick[0]) return false;
    return trick[1] > this.currentTrick[1];
  }

  play(cards: number[]): void {
    const trick = this.cardsToTrick(cards);
    if (!this.playable(cards)) {
      throw new HZGError(ErrorCodes.BigTwoTrickNotPlayable);
    }
    this.currentCards = cards;
    this.currentTrick = trick;
    this.cards[this.playerManager.index] = this.cards[this.playerManager.index].filter(c => !cards.includes(c));
    this.passCount = 0;
  }

  pass(): void {
    this.passCount++;
    if (this.passCount >= this.playerManager.inGamePlayerCount - 1) {
      this.reset();
      this.passCount = 0;
    }
  }

  reset(): void {
    this.currentCards = [];
    this.currentTrick = [BigTwoTrickType.None, -1];
  }

  win(): boolean {
    return this.cards[this.playerManager.index].length <= 0;
  }

  
  cardsToTrick(cards: number[]): BigTwoTrick {
    switch (cards.length) {
      case 1:
        return [BigTwoTrickType.Single, cards[0]];
      
      case 2:
        if (cards[0] >> 2 === cards[1] >> 2) return [BigTwoTrickType.Pair, Math.max(cards[0], cards[1])];
        return [BigTwoTrickType.None, -1];

      case 5:
        cards.sort((a, b) => a - b);

        const ranks = cards.map(c => c >> 2);
        const suits = cards.map(c => c & 3);
        const rankSet = new Set(ranks);
        const suitSet = new Set(suits);
        switch (rankSet.size) {
          case 1:
            return [BigTwoTrickType.None, -1];
          
          case 2:
            return ranks[1] === ranks[3] ? 
              ([BigTwoTrickType.FourOfAKind, ranks[3] === ranks[4] ? cards[4] : cards[3]]) :
              ([BigTwoTrickType.FullHouse, ranks[2] === ranks[4] ? cards[4] : cards[2]]);
          
          case 5:
            const straight = this.checkStraight(cards);
            if (straight < 0) return [BigTwoTrickType.None, -1];
            return [suitSet.size === 1 ? BigTwoTrickType.StraightFlush : BigTwoTrickType.Straight, straight];
        }

      default:
        return [BigTwoTrickType.None, -1];
    }
  }

  protected checkStraight(cards: number[]): number {
    // readibility 0
    const ranks = cards.map(c => c >> 2);
    if (ranks[0] === 8) return -1; // filter out J-2
    if (ranks[4] - ranks[0] === 4) return cards[4]; // 3-7 to 10-A
    if (!(ranks[0] === 0 && ranks[1] === 1 && ranks[2] === 2 && ranks[4] === 12)) return -1;
    if (ranks[3] === 3) return cards[4]; // 2-6
    if (ranks[3] === 11) return cards[2]; // A-5
    return -1;
  }
}