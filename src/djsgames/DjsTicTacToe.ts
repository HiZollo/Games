import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { DjsGameWrapper } from './DjsGameWrapper';
import { TicTacToe } from '../games/TicTacToe';
import { Player } from '../struct/Player';
import { DjsTicTacToeOptions, TicTacToeStrings, DjsInputResult } from '../types/interfaces';
import { AI } from '../util/AI/AI';
import { format, overwrite } from '../util/Functions';
import { ticTacToe } from '../util/strings.json';

export class DjsTicTacToe extends DjsGameWrapper {
  public strings: TicTacToeStrings;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  protected game: TicTacToe;
  protected inputMode: number;
  protected boardButtons: MessageButton[][];

  
  constructor({ players, boardSize = 3, source, strings, time }: DjsTicTacToeOptions) {
    super({ source, time });
    if (boardSize > 4) {
      throw new Error('The size of the board should be at most 4.');
    }
    this.game = new TicTacToe({ players, boardSize });

    this.strings = overwrite(JSON.parse(JSON.stringify(ticTacToe)), strings);
    this.controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_stop')
        .setLabel(this.strings.controller.stop)
        .setStyle("DANGER")
    );

    this.mainMessage = undefined;
    this.controllerMessage = undefined;

    this.inputMode = 0b01;
    this.buttonFilter = this.buttonFilter.bind(this);
    this.messageFilter = this.messageFilter.bind(this);

    this.boardButtons = [];
  }

  async initialize(): Promise<void> {
    this.game.initialize();

    for (let i = 0; i < this.game.boardSize; i++) {
      this.boardButtons.push([]);
      for (let j = 0; j < this.game.boardSize; j++) {
        this.boardButtons[i].push(new MessageButton()
        .setCustomId(`HZG_PLAY_${i}_${j}`)
        .setLabel(this.strings.labels[i][j])
        .setStyle("PRIMARY")
      );
      }
    }

    const content = format(this.strings.nowPlayer, { player: `<@${this.game.playerManager.nowPlayer.id}>`, symbol: this.game.playerManager.nowPlayer.symbol });
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
    return i.user.id === this.game.playerManager.nowPlayer.id;
  }

  protected messageFilter(): boolean {
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

      if (this.game.win(row, col)) {
        this.game.winner = nowPlayer;
        endStatus = "WIN";
      }
      else if (this.game.draw()) {
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

  protected async botMove(bot: Player): Promise<DjsInputResult> {
    if (this.game.playerManager.playerCount !== 2) {
      throw new Error('There should be only one human in the game.');
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
      throw new Error('Something went wrong when sending reply.');
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