export enum BigTwoTrickType {
  None, 
  Single, 
  Pair, 
  Straight, 
  FullHouse, 
  FourOfAKind, 
  StraightFlush
}

export enum TofeDirections {
  Up, 
  Down, 
  Left, 
  Right
};

export enum ChessPiece {
  WHITE = 0x10,
  BLACK = 0x20,
  PAWN   = 0x01,
  KNIGHT = 0x02,
  BISHOP = 0x03,
  ROOK   = 0x04,
  QUEEN  = 0x05,
  KING   = 0x06,
  
  XX = 0x80,
  OO = 0x00,
  WP = 0x11,
  WN = 0x12,
  WB = 0x13,
  WR = 0x14,
  WQ = 0x15,
  WK = 0x16,
  BP = 0x21,
  BN = 0x22,
  BB = 0x23,
  BR = 0x24,
  BQ = 0x25,
  BK = 0x26,
}