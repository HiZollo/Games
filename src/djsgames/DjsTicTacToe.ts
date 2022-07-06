import { ButtonInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { DjsGameWrapper } from './DjsGameWrapper';
import { AI } from '../AI/AI';
import { HZGError, HZGRangeError, ErrorCodes } from '../errors';
import { TicTacToe } from '../games';
import { Player } from '../struct';
import { DjsTicTacToeOptions, TicTacToeStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { ticTacToe } from '../util/strings.json';

export class DjsTicTacToe extends DjsGameWrapper {
  public strings: TicTacToeStrings;
  public controller: MessageActionRow;

  protected game: TicTacToe;
  protected inputMode: number;
  protected boardButtons: MessageButton[][];

  
  constructor({ players, boardSize = 3, source, strings, time }: DjsTicTacToeOptions) {
    super({ source, time });
    if (!(1 <= boardSize && boardSize <= 4)) {
      throw new HZGRangeError(ErrorCodes.OutOfRange, "Parameter boardSize", 1, 4);
    }
    this.game = new TicTacToe({ players, boardSize });

    this.strings = overwrite(JSON.parse(JSON.stringify(ticTacToe)), strings);
    this.controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_leave')
        .setLabel(this.strings.controller.leave)
        .setStyle("DANGER")
    );

    this.inputMode = 0b01;
    this.buttonFilter = this.buttonFilter.bind(this);
    this.messageFilter = this.messageFilter.bind(this);

    this.boardButtons = [];
  }

  async initialize(): Promise<void> {
    for (let i = 0; i < this.game.boardSize; i++) {
      this.boardButtons.push([]);
      for (let j = 0; j < this.game.boardSize; j++) {
        this.boardButtons[i][j] = new MessageButton()
          .setCustomId(`HZG_PLAY_${i}_${j}`)
          .setLabel(this.strings.labels[i][j])
          .setStyle("PRIMARY");
      }
    }

    const player = this.game.playerManager.nowPlayer;
    const content = format(this.strings.nowPlayer, { player: `<@${player.id}>`, symbol: player.symbol });
    await super.initialize({ content, components: [...this.displayBoard, this.controller] });
  }

  fill(row: number, col: number): void {
    this.game.fill(row, col);

    this.boardButtons[row][col]
      .setDisabled(true)
      .setLabel(this.game.board[row][col] ?? this.strings.labels[row][col]);
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


  protected buttonFilter(i: ButtonInteraction): boolean {
    return i.customId.startsWith("HZG") && i.user.id === this.game.playerManager.nowPlayer.id;
  }

  protected messageFilter(): boolean {
    return false;
  }

  protected idleToDo(nowPlayer: Player): DjsInputResult {
    nowPlayer.status.set("IDLE");
    return {
      content: format(this.strings.previous.idle, { player: nowPlayer.username }) + '\n', 
    };
  }

  protected buttonToDo(nowPlayer: Player, input: string): DjsInputResult {
    const args = input.split('_');
    let content = '';
    let endStatus = "";
    if (args[1] === "CTRL" && args[2] === 'leave') {
      this.game.playerManager.kick(nowPlayer.id);
      content = format(this.strings.previous.left, { player: nowPlayer.username }) + '\n';
    }
    else if (args[1] === "PLAY") {
      nowPlayer.status.set("PLAYING");
      nowPlayer.addStep();

      const [row, col] = [parseInt(args[2]), parseInt(args[3])];
      this.fill(row, col);

      if (this.game.win(row, col)) {
        this.game.winner = nowPlayer;
        endStatus = "WIN";
      }
      else if (this.game.draw()) {
        endStatus = "DRAW";
      }
    }
    else {
      throw new HZGError(ErrorCodes.InvalidButtonInteraction);
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

  protected async botMove(bot: Player): Promise<DjsInputResult> {
    if (this.game.playerManager.playerCount !== 2) {
      throw new HZGError(ErrorCodes.OneHumanOnly);
    }

    bot.addStep();

    let endStatus = "";
    const [row, col] = await AI.TicTacToe(this.game.board, bot.symbol);
    this.fill(row, col);

    if (this.game.win(row, col)) {
      this.game.winner = bot;
      endStatus = "WIN";
    }
    else if (this.game.draw()) {
      endStatus = "DRAW";
    }

    return {
      components: [...this.displayBoard, this.controller], 
      content: '', 
      endStatus: endStatus
    };
  }

  protected async update(result: DjsInputResult): Promise<DjsInputResult> {
    if (!this.mainMessage) {
      throw new HZGError(ErrorCodes.InvalidMainMessage);
    }

    this.game.playerManager.next();
    result.content += format(this.strings.nowPlayer, { player: `<@${this.game.playerManager.nowPlayer.id}>`, symbol: this.game.playerManager.nowPlayer.symbol });
    await this.mainMessage.edit(result).catch(() => {
      result.endStatus = "DELETED";
    });
    return result;
  }

  protected async end(status: string): Promise<void> {
    this.game.end(status);

    this.boardButtons.forEach(row => {
      row.forEach(button => {
        button.setDisabled(true);
      })
    });
    await this.mainMessage?.edit({ content: '\u200b', components: this.displayBoard }).catch(() => {});
  }


  private get displayBoard(): MessageActionRow[] {
    const actionRows = [];
    for (let i = 0; i < this.game.boardSize; i++) {
      actionRows.push(new MessageActionRow());
      for (let j = 0; j < this.game.boardSize; j++) {
        actionRows[i].addComponents(this.boardButtons[i][j]);
      }
    }
    return actionRows;
  }
}