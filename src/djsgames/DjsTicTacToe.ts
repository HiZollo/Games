import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { TicTacToeInterface, DjsTicTacToeOptions, TicTacToeStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { GameUtil } from '../util/GameUtil';
import { ticTacToe } from '../util/strings.json';
import { Player } from '../struct/Player';
import { Range } from '../struct/Range';
import { DjsGame } from './DjsGame';

export class DjsTicTacToe extends DjsGame implements TicTacToeInterface {
  public board: (string | null)[][];
  public boardSize: number;

  public strings: TicTacToeStrings;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  private boardButtons: MessageButton[][];
  protected occupiedCount: number;
  protected inputMode: number;

  
  constructor({ boardSize = 3, players, source, strings, time }: DjsTicTacToeOptions) {
    super({ players, playerCountRange: new Range(2, Infinity), source, time });
    if (boardSize > 4) {
      throw new Error('The size of the board should be at most 4.');
    }

    this.board = [];
    this.boardSize = boardSize;

    this.strings = overwrite(JSON.parse(JSON.stringify(ticTacToe)), strings);
    this.boardButtons = [];
    this.controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_stop')
        .setLabel(this.strings.controller.stop)
        .setStyle("DANGER")
    );

    this.mainMessage = undefined;
    this.controllerMessage = undefined;

    this.occupiedCount = 0;
    this.inputMode = 0b01;
  }

  async initialize(): Promise<void> {
    super.initialize();

    for (let i = 0; i < this.boardSize; i++) {
      this.board.push([]);
      this.boardButtons.push([]);
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i].push(null);
        this.boardButtons[i].push(new MessageButton()
        .setCustomId(`HZG_PLAY_${i}_${j}`)
        .setLabel(this.strings.labels[i][j])
        .setStyle("PRIMARY")
      );
      }
    }

    const content = format(this.strings.nowPlayer, { player: `<@${this.playerManager.nowPlayer.id}>`, symbol: this.playerManager.nowPlayer.symbol });
    if ('editReply' in this.source) {
      if (!this.source.inCachedGuild()) { // type guard
        throw new Error('The guild is not cached.');
      }
      if (!this.source.deferred) {
        await this.source.deferReply();
      }
      this.mainMessage = await this.source.editReply({ content: content, components: [...this.displayBoard, this.controller] });
      this.controllerMessage = this.mainMessage;
    }
    else {
      this.mainMessage = await this.source.channel.send({ content: content, components: [...this.displayBoard, this.controller] });
      this.controllerMessage = this.mainMessage;
    }
  }

  fill(row: number, col: number): void {
    if (this.board[row][col] !== null)
      throw new Error(`Trying to fill board[${row}][${col}] that has already been filled.`);

    this.board[row][col] = this.playerManager.nowPlayer.symbol;
    this.boardButtons[row][col]
      .setDisabled(true)
      .setLabel(this.board[row][col] ?? this.strings.labels[row][col]);
    this.occupiedCount++;
    }

  win(row: number, col: number): (string | null) {
    return GameUtil.checkStrike(this.board, row, col, this.boardSize);
  }

  draw(): boolean {
    return this.occupiedCount === this.boardSize ** 2;
  }

  async end(status: string): Promise<void> {
    super.end(status);

    this.boardButtons.forEach(row => {
      row.forEach(button => {
        button.setDisabled(true);
      })
    });
    await this.mainMessage?.edit({ content: '\u200b', components: this.displayBoard }).catch(() => {});
  }

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.status.now) {
      case "WIN":
        return format(message.win, { player: `<@${this.winner?.id}>` });
      case "IDLE":
        return message.idle;
      case "DRAW":
        return message.draw;
      case "STOPPED":
        return message.stopped;
      case "DELETED":
        return message.deleted;
      default:
        return '';
    }
  }


  protected buttonFilter = (i: ButtonInteraction): boolean => {
    return i.user.id === this.playerManager.nowPlayer.id;
  }

  protected messageFilter = (): boolean => {
    return false;
  }

  protected idleToDo(nowPlayer: Player): DjsInputResult {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }

    nowPlayer.status.set("IDLE");
    return {
      content: format(this.strings.previous.idle, { player: nowPlayer.username }) + '\n', 
    };
  }

  protected buttonToDo(nowPlayer: Player, input: string): DjsInputResult {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }
    const args = input.split('_');

    let content = '';
    let endStatus = "";
    if (args[0] !== "HZG") {
      throw new Error('Invalid button received.');
    }
    if (args[1] === "CTRL") {
      nowPlayer.status.set("LEAVING");
      content = format(this.strings.previous.leaving, { player: nowPlayer.username }) + '\n';
    }
    else if (args[1] === "PLAY") {
      nowPlayer.status.set("PLAYING");
      nowPlayer.addStep();

      const [row, col] = [parseInt(args[2]), parseInt(args[3])];
      this.fill(row, col);

      if (this.win(row, col)) {
        this.winner = nowPlayer;
        endStatus = "WIN";
      }
      else if (this.draw()) {
        endStatus = "DRAW";
      }
    }

    return {
      components: [...this.displayBoard, this.controller], 
      content: content, 
      endStatus: endStatus
    };
  }

  protected messageToDo(): DjsInputResult {
    return {};
  }

  protected async update(result: DjsInputResult): Promise<DjsInputResult> {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }

    this.playerManager.next();
    result.content += format(this.strings.nowPlayer, { player: `<@${this.playerManager.nowPlayer.id}>`, symbol: this.playerManager.nowPlayer.symbol });
    await this.mainMessage.edit(result).catch(() => {
      result.endStatus = "DELETED";
    });
    return result;
  }


  private get displayBoard(): MessageActionRow[] {
    const actionRows = [];
    for (let i = 0; i < this.boardSize; i++) {
      actionRows.push(new MessageActionRow());
      for (let j = 0; j < this.boardSize; j++) {
        actionRows[i].addComponents(this.boardButtons[i][j]);
      }
    }
    return actionRows;
  }
}