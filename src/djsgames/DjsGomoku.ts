import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { DjsGameWrapper } from './DjsGameWrapper';
import { Gomoku } from '../games/Gomoku';
import { Player } from '../struct/Player';
import { DjsGomokuOptions, GomokuStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { gomoku } from '../util/strings.json';

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class DjsGomoku extends DjsGameWrapper {
  public strings: GomokuStrings;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  protected game: Gomoku;
  protected inputMode: number;

  
  constructor({ players, boardSize = 9, source, time, strings }: DjsGomokuOptions) {
    super({ source, time });
    if (boardSize > 19) {
      throw new Error('The size of the board should be at most 19.');
    }
    this.game = new Gomoku({ players, boardSize });

    this.strings = overwrite(JSON.parse(JSON.stringify(gomoku)), strings);
    this.controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_stop')
        .setLabel(this.strings.controller.stop)
        .setStyle("DANGER")
    );

    this.mainMessage = undefined;
    this.controllerMessage = undefined;

    this.inputMode = 0b01;
  }

  async initialize(): Promise<void> {
    this.game.initialize();

    const content = format(this.strings.nowPlayer, { player: `<@${this.game.playerManager.nowPlayer.id}>`, symbol: this.game.playerManager.nowPlayer.symbol })
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

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.game.status.now) {
      case "WIN":
        return format(message.win, { player: `<@${this.game.winner?.id}>` });
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
    return i.user.id === this.game.playerManager.nowPlayer.id;
  }

  protected messageFilter = (m: Message): boolean => {
    if (m.author.id !== this.game.playerManager.nowPlayer.id) return false;
    if (!(/^[A-Za-z]\d{1,2}$/.test(m.content))) return false;

    const [row, col] = this.getQuery(m.content);
    if (!(0 <= row && row < this.game.boardSize && 0 <= col && col < this.game.boardSize)) return false;
    return this.game.board[row][col] === null;
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
    this.game.fill(row, col);

    if (this.game.win(row, col)) {
      this.game.winner = nowPlayer;
      endStatus = "WIN";
    }
    else if (this.game.draw()) {
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

    this.game.playerManager.next();
    result.content += format(this.strings.nowPlayer, { player: `<@${this.game.playerManager.nowPlayer.id}>`, symbol: this.game.playerManager.nowPlayer.symbol })
                    + '\n' + this.boardContent;
    await this.mainMessage.edit(result).catch(() => {
      result.endStatus = "DELETED";
    });
    return result;
  }

  protected async end(status: string): Promise<void> {
    this.game.end(status);

    await this.mainMessage?.edit({ content: this.boardContent, components: [] }).catch(() => {});
  }


  private get boardContent(): string {
    let content = `${this.strings.corner}`;
    for (let i = 0; i < this.game.boardSize; i++) {
      content += '\u200b' + this.strings.columns[i];
    }

    for (let i = this.game.boardSize - 1; i >= 0; i--) {
      content += '\n' + this.strings.rows[i];
      for (let j = 0; j < this.game.boardSize; j++)
        content += this.game.board[i][j] !== null ? this.game.board[i][j] : this.strings.grid;
    }
    return content;
  }

  private getQuery(content: string): number[] {
    let [_, col, row] = content.toLowerCase().match(/([a-z])(\d{1,2})/) ?? ['', 'Z', '100'];
    return [parseInt(row, 10) - 1, col.charCodeAt(0) - 'a'.charCodeAt(0)];
  }
}