import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { GomokuInterface, DjsGomokuOptions, GomokuStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { GameUtil } from '../util/GameUtil';
import { gomoku } from '../util/strings.json';
import { Player } from '../struct/Player';
import { Range } from '../struct/Range';
import { DjsGame } from './DjsGame';

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class DjsGomoku extends DjsGame implements GomokuInterface {
  public board: (string | null)[][];
  public boardSize: number;

  public strings: GomokuStrings;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  protected occupiedCount: number;
  protected inputMode: number;

  
  constructor({ boardSize = 9, players, source, strings, time }: DjsGomokuOptions) {
    super({ playerManagerOptions: { players, playerCountRange: new Range(1, Infinity) }, source, time });
    if (boardSize > 19) {
      throw new Error('The size of the board should be at most 19.');
    }

    this.board = [];
    this.boardSize = boardSize;

    this.strings = overwrite(JSON.parse(JSON.stringify(gomoku)), strings);
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
      for (let j = 0; j < this.boardSize; j++)
        this.board[i].push(null);
    }

    const content = format(this.strings.nowPlayer, { player: `<@${this.playerManager.nowPlayer.id}>`, symbol: this.playerManager.nowPlayer.symbol })
                  + '\n' + this.boardContent
    if ('editReply' in this.source) {
      if (!this.source.inCachedGuild()) { // type guard
        throw new Error('The guild is not cached.');
      }
      if (!this.source.deferred) {
        await this.source.deferReply();
      }
      this.mainMessage = await this.source.editReply({ content: content, components: [this.controller] });
      this.controllerMessage = this.mainMessage;
    }
    else {
      this.mainMessage = await this.source.channel.send({ content: content, components: [this.controller] });
      this.controllerMessage = this.mainMessage;
    }
  }

  fill(row: number, col: number): void {
    if (this.board[row][col] !== null)
      throw new Error(`Trying to fill board[${row}][${col}] that has already been filled.`);

    this.board[row][col] = this.playerManager.nowPlayer.symbol;
    this.occupiedCount++;
  }

  win(row: number, col: number): (string | null) {
    return GameUtil.checkStrike(this.board, row, col, 5);
  }

  draw(): boolean {
    return this.occupiedCount === this.boardSize ** 2;
  }

  async end(status: string): Promise<void> {
    super.end(status);

    await this.mainMessage?.edit({ content: this.boardContent, components: [] }).catch(() => {});
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

  protected messageFilter = (m: Message): boolean => {
    if (m.author.id !== this.playerManager.nowPlayer.id) return false;
    if (!(/^[A-Za-z]\d{1,2}$/.test(m.content))) return false;

    const [row, col] = this.getQuery(m.content);
    if (!(0 <= row && row < this.boardSize && 0 <= col && col < this.boardSize)) return false;
    return this.board[row][col] === null;
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

    if (args[0] !== "HZG") {
      throw new Error('Invalid button received.');
    }

    nowPlayer.status.set("LEAVING");
    return {
      content: format(this.strings.previous.leaving, { player: nowPlayer.username }) + '\n'
    };
  }

  protected messageToDo(nowPlayer: Player, input: string): DjsInputResult {
    nowPlayer.status.set("PLAYING");
    nowPlayer.addStep();

    const [row, col] = this.getQuery(input);
    let endStatus = "";
    this.fill(row, col);

    if (this.win(row, col)) {
      this.winner = nowPlayer;
      endStatus = "WIN";
    }
    else if (this.draw()) {
      endStatus = "DRAW";
    }

    return {
      content: format(this.strings.previous.move, { col: alphabets[col], row: row + 1, player: nowPlayer.username }) + '\n', 
      endStatus: endStatus
    };
  }

  protected async update(result: DjsInputResult): Promise<DjsInputResult> {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }

    this.playerManager.next();
    result.content += format(this.strings.nowPlayer, { player: `<@${this.playerManager.nowPlayer.id}>`, symbol: this.playerManager.nowPlayer.symbol })
                    + '\n' + this.boardContent;
    await this.mainMessage.edit(result).catch(() => {
      result.endStatus = "DELETED";
    });
    return result;
  }


  private get boardContent(): string {
    let content = `${this.strings.corner}`;
    for (let i = 0; i < this.boardSize; i++) {
      content += '\u200b' + this.strings.columns[i];
    }

    for (let i = this.boardSize - 1; i >= 0; i--) {
      content += '\n' + this.strings.rows[i];
      for (let j = 0; j < this.boardSize; j++)
        content += this.board[i][j] !== null ? this.board[i][j] : this.strings.grid;
    }
    return content;
  }

  private getQuery(content: string): number[] {
    let [_, col, row] = content.toLowerCase().match(/([a-z])(\d{1,2})/) ?? ['', 'Z', '100'];
    return [parseInt(row, 10) - 1, col.charCodeAt(0) - 'a'.charCodeAt(0)];
  }
}