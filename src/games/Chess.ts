import { HZGRangeError, ErrorCodes, HZGError } from '../errors';
import { Game, Player, Range } from '../struct';
import { IChess, ChessOptions, ChessMove, ChessPiece as Piece, ChessMoveSuccess } from '../types'

export class Chess extends Game implements IChess {
  public board: Piece[][];
  public winner: Player | null;
  public history: ChessMoveSuccess[];
  public drawn: boolean;
  public drawCounter: number;
  public shortCastleRight: [boolean, boolean];
  public longCastleRight: [boolean, boolean];
  private positionCount: Map<string, number>;
  
  constructor({ players }: ChessOptions ) {
    if (players.length !== 2) {
      throw new HZGRangeError(ErrorCodes.OutOfRange, "Player count", 2, 2);
    }

    super({ playerManagerOptions: { players, playerCountRange: new Range(2, Infinity), requireSymbol: true } });

    this.board = [
      [Piece.BR, Piece.BN, Piece.BB, Piece.BQ, Piece.BK, Piece.BB, Piece.BN, Piece.BR],
      [Piece.BP, Piece.BP, Piece.BP, Piece.BP, Piece.BP, Piece.BP, Piece.BP, Piece.BP],
      [Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO],
      [Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO],
      [Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO],
      [Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO, Piece.OO],
      [Piece.WP, Piece.WP, Piece.WP, Piece.WP, Piece.WP, Piece.WP, Piece.WP, Piece.WP],
      [Piece.WR, Piece.WN, Piece.WB, Piece.WQ, Piece.WK, Piece.WB, Piece.WN, Piece.WR],
    ];

    this.winner = null;
    this.history = [];
    this.drawn = false;
    this.drawCounter = 0;
    this.shortCastleRight = [true, true];
    this.longCastleRight = [true, true];

    this.positionCount = new Map();
    this.storeCurrentPosition();
  }

  get lastMove(): ChessMoveSuccess | undefined {
    return this.history[this.history.length - 1];
  }

  move(notation: string) {
    if (this.winner || this.drawn) {
      throw new HZGError(ErrorCodes.GameAlreadyEnded);
    }

    const move = this.parseNotation(notation);
    if (move.error) {
      throw new HZGError(ErrorCodes.ChessIllegalMove, notation);
    }

    this._move(move);

    if (move.checkMate || move.capture && (move.capture & 0x0F) === Piece.KING) {
      this.winner = this.playerManager.players[move.piece & Piece.WHITE ? 0 : 1];
      return;
    }

    // 50-move rule
    if ((move.piece & 0x0F) === Piece.PAWN || move.capture) {
      this.drawCounter = 0;
    } else {
      this.drawCounter++;
    }
    if (this.drawCounter >= 100) {
      this.drawn = true;
    }

    // 3-fold repetition
    const count = this.storeCurrentPosition();
    if (count >= 3) {
      this.drawn = true;
    }

    // insufficient material
    if (this.checkInsufficientMaterial()) {
      this.drawn = true;
    }

    // stalemate
    const nextMoves = this.genMoves(move.piece & 0x30 ^ 0x30);
    if (nextMoves.length === 0) {
      this.drawn = true;
    }
  }

  win(): (Player | null) {
    return this.winner;
  }

  draw(): boolean {
    return this.drawn;
  }

  parseNotation(notation: string): ChessMove {
    let move = this.parseMovement(notation);
    if (move.error) return move;

    move = this.parseCheck(move);
    if (move.error) return move;
  
    const side = (move.piece & 0x30) === Piece.WHITE ? 0 : 1;
    const hr = side ? 0 : 7;
    if (this.shortCastleRight[side]) {
      if ((move.piece & 0x0F) === Piece.KING) move.selfLostShortCastle = true;
      if ((move.piece & 0x0F) === Piece.ROOK && move.from[0] === hr && move.from[1] === 7) move.selfLostShortCastle = true;
    }
    if (this.longCastleRight[side]) {
      if ((move.piece & 0x0F) === Piece.KING) move.selfLostLongCastle = true;
      if ((move.piece & 0x0F) === Piece.ROOK && move.from[0] === hr && move.from[1] === 0) move.selfLostLongCastle = true;
    }
    if (move.capture && (move.capture & 0x0F) === Piece.ROOK) {
      if (this.shortCastleRight[1-side] && move.to[0] === 7-hr && move.to[1] === 7) move.oppoLostShortCastle = true;
      if (this.longCastleRight[1-side] && move.to[0] === 7-hr && move.to[1] === 0) move.oppoLostLongCastle = true;
    }
    return move;
  }

  piece(i: number, j: number): Piece {
    return this.board[i]?.[j] === undefined ? Piece.XX : this.board[i][j];
  }

  rankToIndex(rank: string): number {
    if (!/^[1-8]$/.test(rank)) return -1;
    return 8 - +rank[0];
  }

  fileToIndex(file: string): number {
    if (!/^[a-h]$/.test(file)) return -1;
    return file.charCodeAt(0) - "a".charCodeAt(0);
  }

  squareToIndex(square: string): [number, number] {
    square = square.toLowerCase();
    if (!/^[a-h][1-8]$/.test(square)) return [-1, -1];
    return [this.rankToIndex(square[1]), this.fileToIndex(square[0])];
  }

  genMoves(side: Piece.WHITE | Piece.BLACK) {
    const moves: ChessMoveSuccess[] = [];
    const addMove = (move: ChessMoveSuccess) => {
      this._move(move);
      const isChecked = this.inCheck(side);
      this._undoMove();

      if (!isChecked) {
        moves.push(move);
      }
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        if (!(piece & side)) continue;
        const vision = this.vision(piece, i, j);
        for (const [p, ii, jj] of vision) {
          const capture = p === Piece.OO ? undefined : p;
          addMove({ piece, from: [i, j], to: [ii, jj], capture });
        }

        switch (piece & 0x0F) {
          case Piece.PAWN: {
            const oppoPawn = piece ^ 0x30;
            const start = side === Piece.WHITE ? 6 : 1;
            const pd = side === Piece.WHITE ? -1 : 1;
            const lm = this.lastMove;
            if (i === start && this.piece(i+pd, j) === Piece.OO && this.piece(i+pd*2, j) === Piece.OO)
              addMove({ piece, from: [i, j], to: [i+pd*2, j] });
            if (lm && lm.piece === oppoPawn && Math.abs(lm.from[0] - lm.to[0]) === 2 && Math.abs(lm.from[1] - j) === 1 && i === start+pd*3)
              addMove({ piece, from: [i, j], to: [i+pd, lm.from[1]], capture: oppoPawn, enPassant: true });
          } break;
          case Piece.KING: {
            if (this.shortCastleRight[side === Piece.WHITE ? 0 : 1] && this.piece(i, j+1) === Piece.OO && this.piece(i, j+2) === Piece.OO && !this._inCheck(side, i, j) && !this._inCheck(side, i, j+1) && !this._inCheck(side, i, j+2))
              addMove({ piece, from: [i, j], to: [i, j+2], castle: "SHORT" })
            if (this.longCastleRight[side === Piece.WHITE ? 0 : 1] && this.piece(i, j-1) === Piece.OO && this.piece(i, j-2) === Piece.OO && this.piece(i, j-3) === Piece.OO && !this._inCheck(side, i, j) && !this._inCheck(side, i, j-1) && !this._inCheck(side, i, j-2))
              addMove({ piece, from: [i, j], to: [i, j-2], castle: "LONG" })
          } break;
        }
      }
    }

    return moves;
  }

  private _move(move: ChessMoveSuccess) {
    this.history.push(move);

    if (move.selfLostShortCastle)
      this.shortCastleRight[(move.piece & 0x30) === Piece.WHITE ? 0 : 1] = false;
    if (move.selfLostLongCastle)
      this.longCastleRight[(move.piece & 0x30) === Piece.WHITE ? 0 : 1] = false;
    if (move.oppoLostShortCastle)
      this.shortCastleRight[(move.piece & 0x30) === Piece.WHITE ? 1 : 0] = false;
    if (move.oppoLostLongCastle)
      this.longCastleRight[(move.piece & 0x30) === Piece.WHITE ? 1 : 0] = false;

    if (move.castle === "SHORT") {
      const i = move.piece & Piece.WHITE ? 7 : 0;
      this.board[i][6] = this.board[i][4];
      this.board[i][5] = this.board[i][7];
      this.board[i][4] = Piece.OO;
      this.board[i][7] = Piece.OO;
      return;
    }
    if (move.castle === "LONG") {
      const i = move.piece & Piece.WHITE ? 7 : 0;
      this.board[i][2] = this.board[i][4];
      this.board[i][3] = this.board[i][0];
      this.board[i][0] = Piece.OO;
      this.board[i][4] = Piece.OO;
      return;
    }
    if (move.enPassant) {
      this.board[move.from[0]][move.from[1]] = Piece.OO;
      this.board[move.from[0]][move.to[1]] = Piece.OO;
      this.board[move.to[0]][move.to[1]] = move.piece;
      return;
    }

    this.board[move.from[0]][move.from[1]] = Piece.OO;
    this.board[move.to[0]][move.to[1]] = move.promote ?? move.piece;
  }

  private _undoMove() {
    const move = this.history.pop();
    if (!move) return;

    if (move.selfLostShortCastle)
      this.shortCastleRight[(move.piece & 0x30) === Piece.WHITE ? 0 : 1] = true;
    if (move.selfLostLongCastle)
      this.longCastleRight[(move.piece & 0x30) === Piece.WHITE ? 0 : 1] = true;
    if (move.oppoLostShortCastle)
      this.shortCastleRight[(move.piece & 0x30) === Piece.WHITE ? 1 : 0] = true;
    if (move.oppoLostLongCastle)
      this.longCastleRight[(move.piece & 0x30) === Piece.WHITE ? 1 : 0] = true;

    if (move.castle === "SHORT") {
      const i = move.piece & Piece.WHITE ? 7 : 0;
      this.board[i][7] = this.board[i][5];
      this.board[i][4] = this.board[i][6];
      this.board[i][5] = Piece.OO;
      this.board[i][6] = Piece.OO;
      return;
    }
    if (move.castle === "LONG") {
      const i = move.piece & Piece.WHITE ? 7 : 0;
      this.board[i][4] = this.board[i][2];
      this.board[i][0] = this.board[i][3];
      this.board[i][2] = Piece.OO;
      this.board[i][3] = Piece.OO;
      return;
    }
    if (move.enPassant) {
      this.board[move.from[0]][move.from[1]] = move.piece;
      this.board[move.from[0]][move.to[1]] = move.capture!;
      this.board[move.to[0]][move.to[1]] = Piece.OO;
      return;
    }

    this.board[move.from[0]][move.from[1]] = move.piece;
    this.board[move.to[0]][move.to[1]] = move.capture ?? Piece.OO;
  }

  private parseMovement(move: string): ChessMove {
    const side = this.playerManager.index;

    // pawn push
    if (/^[a-h][1-8](=?[QRBN])?[+#]?$/.test(move)) {
      move = move.replace("=", "");
      const [i, j] = this.squareToIndex(move.substring(0, 2));
      const pawn = side ? Piece.BP : Piece.WP;
      const pd = side ? 1 : -1;
      const start = side ? 1 : 6;
      if (this.piece(i, j) !== Piece.OO) return { error: true, message: "Pawn is obstructed." };
      if (this.piece(start, j) === pawn && this.piece(i-pd, j) === Piece.OO && i-pd*2 === start) return { piece: pawn, from: [start, j], to: [i, j] };
      if (this.piece(i-pd, j) !== pawn) return { error: true, message: "Invalid pawn move." };
      // promotion
      if (i === start + pd*6) {
        if (!move[2]) return { error: true, message: "Specify the promotion piece." };
        const promote = 
          move[2] === "Q" ? Piece.WQ :
          move[2] === "R" ? Piece.WR :
          move[2] === "B" ? Piece.WB : Piece.WN;
        return { piece: pawn, from: [i-pd, j], to: [i, j], promote };
      } else if (move[2]) {
        return { error: true, message: "Invalid promotion." };
      }
      return { piece: pawn, from: [i-pd, j], to: [i, j] };
    }

    // pawn capture
    if (/^[a-h]x?[a-h][1-8](=?[QRBN])?[+#]?$/.test(move)) {
      move = move.replace("=", "").replace("x", "");
      const [i, j] = this.squareToIndex(move.substring(1, 3));
      const f = this.fileToIndex(move[0]);
      if (Math.abs(f - j) !== 1) return { error: true, message: "Invalid pawn move." };
      
      const target = this.piece(i, j);
      const lm = this.lastMove;
      if (side === 0) {
        if (this.piece(i+1, f) !== Piece.WP) return { error: true, message: "Invalid pawn move." };
        // en passant
        if (target === Piece.OO) {
          const jPawnPushTwoSquares = lm && lm.piece === Piece.BP && lm.from[0] === 1 && lm.from[1] === j && lm.to[0] === 3;
          if (i == 2 && jPawnPushTwoSquares) return { piece: Piece.WP, from: [3, f], to: [2, j], enPassant: true, capture: Piece.BP };
          return { error: true, message: "Invalid pawn capture." };
        }
        if (!(target & Piece.BLACK)) return { error: true, message: "Invalid pawn capture." };
        // promotion
        if (i === 0) {
          if (!move[3]) return { error: true, message: "Specify the promotion piece." };
          const promote = 
            move[3] === "Q" ? Piece.WQ :
            move[3] === "R" ? Piece.WR :
            move[3] === "B" ? Piece.WB : Piece.WN;
          return { piece: Piece.WP, from: [1, f], to: [0, j], capture: target, promote };
        } else if (move[3]) {
          return { error: true, message: "Invalid promotion." };
        }
        return { piece: Piece.WP, from: [i+1, f], to: [i, j], capture: target };
      } else {
        if (this.piece(i-1, f) !== Piece.BP) return { error: true, message: "Invalid pawn move." };
        // en passant
        if (target === Piece.OO) {
          const jPawnPushTwoSquares = lm && lm.piece === Piece.WP && lm.from[0] === 6 && lm.from[1] === j && lm.to[0] === 4;
          if (i == 5 && jPawnPushTwoSquares) return { piece: Piece.BP, from: [4, f], to: [5, j], enPassant: true, capture: Piece.WP };
          return { error: true, message: "Invalid pawn capture." };
        }
        if (!(target & Piece.WHITE)) return { error: true, message: "Invalid pawn capture." };
        // promotion
        if (i === 7) {
          if (!move[3]) return { error: true, message: "Specify the promotion piece." };
          const promote = 
            move[3] === "Q" ? Piece.BQ :
            move[3] === "R" ? Piece.BR :
            move[3] === "B" ? Piece.BB : Piece.BN;
          return { piece: Piece.BP, from: [6, f], to: [7, j], capture: target, promote };
        } else if (move[3]) {
          return { error: true, message: "Invalid promotion." };
        }
        return { piece: Piece.BP, from: [i-1, f], to: [i, j], capture: target };
      }
    }

    // short castle
    if (/^O-O[+#]?$/.test(move) || /^0-0[+#]?$/.test(move)) {
      if (!this.shortCastleRight[side]) return { error: true, message: "Lost castling right." };
      const hr = side ? 0 : 7;
      const king = side ? Piece.BK : Piece.WK;
      if (this.piece(hr, 5) !== Piece.OO || this.piece(hr, 6) !== Piece.OO)
        return { error: true, message: "Piece obstruction." };
      if (this._inCheck(side ? Piece.BLACK : Piece.WHITE, hr, 4))
        return { error: true, message: "Currently in check." };
      if (this._inCheck(side ? Piece.BLACK : Piece.WHITE, hr, 5))
        return { error: true, message: "Castle through check." };
      if (this._inCheck(side ? Piece.BLACK : Piece.WHITE, hr, 6))
        return { error: true, message: "Castle into check." };
      return { piece: king, from: [hr, 4], to: [hr, 6], castle: "SHORT", selfLostShortCastle: true, selfLostLongCastle: true };
    }

    // long castle
    if (/^O-O-O[+#]?$/.test(move) || /^0-0-0[+#]?$/.test(move)) {
      if (!this.longCastleRight[side]) return { error: true, message: "Lost castling right." };
      const hr = side ? 0 : 7;
      const king = side ? Piece.BK : Piece.WK;
      if (this.piece(hr, 1) !== Piece.OO || this.piece(hr, 2) !== Piece.OO|| this.piece(hr, 3) !== Piece.OO)
        return { error: true, message: "Piece obstruction." };
      if (this._inCheck(side ? Piece.BLACK : Piece.WHITE, hr, 4))
        return { error: true, message: "Currently in check." };
      if (this._inCheck(side ? Piece.BLACK : Piece.WHITE, hr, 3))
        return { error: true, message: "Castle through check." };
      if (this._inCheck(side ? Piece.BLACK : Piece.WHITE, hr, 2))
        return { error: true, message: "Castle into check." };
      return { piece: king, from: [hr, 4], to: [hr, 2], castle: "LONG", selfLostShortCastle: true, selfLostLongCastle: true };
    }

    // piece move
    if (/^[KQRBN][a-h]?[1-8]?x?[a-h][1-8][+#]?$/.test(move)) {
      const [_, pieceStr, auxF, auxR, capture, sq] = move.match(/^([KQRBN])([a-h]?)([1-8]?)(x?)([a-h][1-8])[+#]?$/)!;
      const auxI = this.rankToIndex(auxR);
      const auxJ = this.fileToIndex(auxF);
      const [i, j] = this.squareToIndex(sq);
      const target = this.piece(i, j);
      const selfPiece = this.strToPiece(pieceStr) | (side ? Piece.BLACK : Piece.WHITE);
      const oppoPiece = selfPiece ^ 0x30;

      const vision = this.vision(oppoPiece, i, j);
      const candidates = vision.filter(([p, ii, jj]) => p === selfPiece && (auxI === -1 || ii === auxI) && (auxJ === -1 || jj === auxJ));
      if (candidates.length === 0) return { error: true, message: "Invalid move." };
      if (candidates.length !== 1) return { error: true, message: "Specify which piece." };
      if (capture && (target & 0x30) !== (side ? Piece.WHITE : Piece.BLACK)) return { error: true, message: "Invalid capture." };
      if (target && (target & 0x30) === (side ? Piece.BLACK : Piece.WHITE)) return { error: true, message: "No self capture." };

      return { piece: selfPiece, from: [candidates[0][1], candidates[0][2]], to: [i, j], capture: target || undefined };
    }

    return { error: true, message: "Invalid move (fallback)." };
  }

  private parseCheck(move: ChessMoveSuccess): ChessMove {
    this._move(move);

    const isChecked = this.inCheck(this.playerManager.index ? Piece.BLACK : Piece.WHITE);
    if (isChecked) {
      this._undoMove();
      return { error: true, message: "In check." };
    }

    const isChecking = this.inCheck(this.playerManager.index ? Piece.WHITE : Piece.BLACK);
    if (isChecking) {
      const isCheckMating = this.inCheckMate(this.playerManager.index ? Piece.WHITE : Piece.BLACK);
      this._undoMove();
      return { ...move, check: true, checkMate: isCheckMating };
    }

    this._undoMove();
    return move;
  }

  private inCheck(side: Piece.WHITE | Piece.BLACK): boolean {
    const selfKing = side | Piece.KING;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.piece(i, j) === selfKing) {
          return this._inCheck(side, i, j);
        }
      }
    }
    return false;
  }

  private _inCheck(side: Piece.WHITE | Piece.BLACK, i: number, j: number): boolean {
    for (const piece of [Piece.PAWN, Piece.KNIGHT, Piece.BISHOP, Piece.ROOK, Piece.QUEEN, Piece.KING]) {
      const selfPiece = side | piece;
      const oppoPiece = side ^ 0x30 | piece;
      const vision = this.vision(selfPiece, i, j);
      if (vision.some(([p]) => p === oppoPiece)) return true;
    }
    return false;
  }

  private inCheckMate(side: Piece.WHITE | Piece.BLACK): boolean {
    const moves = this.genMoves(side);
    return moves.length === 0;
  }

  private strToPiece(str: string) {
    switch(str) {
      case "N": return Piece.KNIGHT;
      case "B": return Piece.BISHOP;
      case "R": return Piece.ROOK;
      case "Q": return Piece.QUEEN;
      case "K": return Piece.KING;
    }
    return Piece.XX;
  }

  private vision(piece: Piece, i: number, j: number): [Piece, number, number][] {
    const color = piece & 0x30;
    const oppo = color ^ 0x30;
    const result: [Piece, number, number][] = [];
    switch (piece) {
      case Piece.WK: case Piece.BK: {
        const sq = [[i-1, j-1], [i-1, j], [i-1, j+1], [i, j-1], [i, j], [i, j+1], [i+1, j-1], [i+1, j], [i+1, j+1]];
        for (const [k, l] of sq) {
          const piece = this.piece(k, l);
          if (piece === Piece.OO || (piece & 0x30) === oppo)
            result.push([piece, k, l]);
        }
      } break;

      case Piece.WP: {
        if (this.piece(i-1, j) === Piece.OO) result.push([this.piece(i-1, j), i-1, j]);
        if ((this.piece(i-1, j-1) & 0x30) === oppo) result.push([this.piece(i-1, j-1), i-1, j-1]);
        if ((this.piece(i-1, j+1) & 0x30) === oppo) result.push([this.piece(i-1, j+1), i-1, j+1]);
      } break;

      case Piece.BP: {
        if (this.piece(i+1, j) === Piece.OO) result.push([this.piece(i+1, j), i+1, j]);
        if ((this.piece(i+1, j-1) & 0x30) === oppo) result.push([this.piece(i+1, j-1), i+1, j-1]);
        if ((this.piece(i+1, j+1) & 0x30) === oppo) result.push([this.piece(i+1, j+1), i+1, j+1]);
      } break;

      case Piece.WN: case Piece.BN: {
        const sq = [[i+2, j+1], [i-2, j+1], [i+2, j-1], [i-2, j-1], [i+1, j+2], [i-1, j+2], [i+1, j-2], [i-1, j-2]];
        for (const [k, l] of sq) {
          const piece = this.piece(k, l);
          if (piece === Piece.OO || (piece & 0x30) === oppo)
            result.push([piece, k, l]);
        }
      } break;

      case Piece.WB: case Piece.BB: case Piece.WQ: case Piece.BQ: {
        const dir = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (const [di, dj] of dir) {
          for (let r = i+di, f = j+dj; ; r+=di, f+=dj) {
            const target = this.piece(r, f);
            if (target === Piece.XX) break;
            if ((target & 0x30) === color) break;
            result.push([target, r, f]);
            if ((target & 0x30) === oppo) break;
          }
        }
      };
      if (piece === Piece.WB || piece === Piece.BB) break;

      case Piece.WR: case Piece.BR: {
        const dir = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [di, dj] of dir) {
          for (let r = i+di, f = j+dj; ; r+=di, f+=dj) {
            const target = this.piece(r, f);
            if (target === Piece.XX) break;
            if ((target & 0x30) === color) break;
            result.push([target, r, f]);
            if ((target & 0x30) === oppo) break;
          }
        }
      };
    }
    return result;
  }

  private checkInsufficientMaterial(): boolean {
    const white = { dBishop: 0, lBishop: 0, knight: 0 };
    const black = { dBishop: 0, lBishop: 0, knight: 0 };
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        const pieceType = piece & 0x0F;
        if (pieceType === Piece.KING || pieceType === Piece.OO) continue;
        if (pieceType === Piece.QUEEN || pieceType === Piece.ROOK || pieceType === Piece.PAWN) return false;

        const color = piece & 0x30;
        if (pieceType === Piece.KNIGHT) {
          const n = ++(color === Piece.WHITE ? white : black).knight;
          if (n >= 2) return false;
        }
        if (pieceType === Piece.BISHOP) {
          const key = (i + j) & 1 ? "dBishop" : "lBishop";
          ++(color === Piece.WHITE ? white : black)[key];
        }
      }
    }

    if (white.dBishop && black.dBishop && !white.lBishop && !black.lBishop && !white.knight && !black.knight) return true;
    if (white.lBishop && black.lBishop && !white.dBishop && !black.dBishop && !white.knight && !black.knight) return true;
    if (white.dBishop + white.lBishop + white.knight + black.dBishop + black.lBishop + black.knight >= 2) return false;
    return true;
  }

  private pieceTable: Record<number, string> = {
    [Piece.WP]: "P",
    [Piece.WN]: "N",
    [Piece.WB]: "B",
    [Piece.WR]: "R",
    [Piece.WQ]: "Q",
    [Piece.WK]: "K",
    [Piece.BP]: "p",
    [Piece.BN]: "n",
    [Piece.BB]: "b",
    [Piece.BR]: "r",
    [Piece.BQ]: "q",
    [Piece.BK]: "k",
    [Piece.OO]: " "
  };

  private storeCurrentPosition() {
    let str = "";
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        str += this.pieceTable[this.board[i][j]];
      }
    }

    str += this.playerManager.index ? "B" : "W";

    str += this.shortCastleRight[0] ? "K" : "x";
    str += this.longCastleRight[0] ? "Q" : "x";
    str += this.shortCastleRight[1] ? "k" : "x";
    str += this.longCastleRight[1] ? "q" : "x";

    const lm = this.lastMove;
    if (lm && (lm.piece & 0x0F) === Piece.PAWN && Math.abs(lm.from[0] - lm.to[0]) === 2) {
      const oppoPawn = lm.piece & 0x30 ^ 0x30 | Piece.PAWN;
      const [i, j] = lm.to;
      if (this.piece(i, j-1) === oppoPawn || this.piece(i, j+1) === oppoPawn) {
        str += "E";
      }
    }

    const count = (this.positionCount.get(str) ?? 0) + 1;
    this.positionCount.set(str, count);
    return count;
  }
}