import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { LightsUpInterface, DjsLightsUpOptions, LightsUpStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { GameUtil } from '../util/GameUtil';
import { lightsUp } from '../util/strings.json';
import { Player } from '../struct/Player';
import { Range } from '../struct/Range';
import { DjsGame } from './DjsGame';

export class DjsLightsUp extends DjsGame implements LightsUpInterface {
  public answer: boolean[][];
  public board: boolean[][];
  public boardSize: number;

  public strings: LightsUpStrings;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  private boardButtons: MessageButton[][];
  protected answered: boolean;
  protected inputMode: number;

  constructor({ boardSize = 5, players, source, strings, time, gameStatus = [] }: DjsLightsUpOptions) {
    super({ playerManagerOptions: { players, playerCountRange: new Range(1, 1) }, source, time, gameStatus });
    if (boardSize > 5) {
      throw new Error('The size of the board should be at most 5.');
    }

    this.answer = [];
    this.board = [];
    this.boardSize = boardSize;

    this.strings = overwrite(JSON.parse(JSON.stringify(lightsUp)), strings);
    this.boardButtons = this.getBoardButtons();
    this.controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_answer')
        .setLabel(this.strings.controller.answer)
        .setStyle("SUCCESS"), 
      new MessageButton()
        .setCustomId('HZG_CTRL_stop')
        .setLabel(this.strings.controller.stop)
        .setStyle("DANGER")
    );

    this.mainMessage = undefined;
    this.controllerMessage = undefined;

    this.answered = false;
    this.inputMode = 0b10;
  }

  async initialize(): Promise<void> {
    super.initialize();

    for (let i = 0; i < this.boardSize; i++) {
      this.board.push([]);
      for (let j = 0; j < this.boardSize; j++)
        this.board[i].push(true);
    }

    for (let i = 0; i < this.boardSize; i++) {
      this.answer.push([]);
      for (let j = 0; j < this.boardSize; j++) {
        this.answer[i].push(false);
        if (GameUtil.randomInt(0, 1)) {
          this.flip(i, j);
        }
      }
    }

    if ('editReply' in this.source) {
      if (!this.source.inCachedGuild()) { // type guard
        throw new Error('The guild is not cached.');
      }
      if (!this.source.deferred) {
        await this.source.deferReply();
      }
      this.mainMessage = await this.source.editReply({ content: '\u200b', components: this.displayBoard });
      this.controllerMessage = await this.source.followUp({ content: '\u200b', components: [this.controller] });
    }
    else {
      this.mainMessage = await this.source.channel.send({ content: '\u200b', components: this.displayBoard });
      this.controllerMessage = await this.mainMessage.reply({ content: '\u200b', components: [this.controller] });
    }
  }

  flip(row: number, col: number): void {
    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
      const nr = row + dr, nc = col + dc;
      if (0 <= nr && nr < this.boardSize && 0 <= nc && nc < this.boardSize) {
        this.board[nr][nc] = !this.board[nr][nc];
        this.boardButtons[nr][nc].setStyle(this.board[nr][nc] ? "PRIMARY" : "SECONDARY");
      }
    });
    this.answer[row][col] = !this.answer[row][col];
  }

  win(): boolean {
    for (let i = 0; i < this.boardSize; i++)
      for (let j = 0; j < this.boardSize; j++)
        if (!this.board[i][j]) return false;
    return true;
  }

  async end(status: string): Promise<void> {
    super.end(status);

    this.boardButtons.forEach(row => {
      row.forEach(button => {
        button.setDisabled(true);
      })
    });

    await this.mainMessage?.edit({ components: this.displayBoard });
    await this.controllerMessage?.delete().catch(() => {});
  }

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.status.now) {
      case "JACKPOT":
        return format(message.jackpot, { player: `<@${this.winner?.id}>` });
      case "WIN":
        return format(this.answered ? message.win : message.unansweredWin, { player: `<@${this.winner?.id}>` });
      case "IDLE":
        return message.idle;
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
    return true;
  }

  protected idleToDo(nowPlayer: Player): DjsInputResult {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }

    nowPlayer.status.set("IDLE");
    return {
      components: this.displayBoard, 
      content: '\u200b', 
      endStatus: ""
    };
  }

  protected buttonToDo(nowPlayer: Player, input: string): DjsInputResult {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }
    const args = input.split('_');

    if (args[0] != "HZG") {
      throw new Error('Invalid button received.');
    }
    
    let endStatus = "";
    if (args[1] === "CTRL") {
      if (args[2] === 'stop') {
        nowPlayer.status.set("LEAVING");
      }
      if (args[2] === 'answer') {
        nowPlayer.status.set("PLAYING");
        this.ephemeralFollowUp({ content: format(this.strings.currentAnswer, { answer: this.answerContent }) });
      }
    }
    else if (args[1] === "PLAY") {
      nowPlayer.status.set("PLAYING");
      nowPlayer.addStep();

      this.flip(parseInt(args[2], 10), parseInt(args[3], 10));

      if (this.win()) {
        this.winner = nowPlayer;
        endStatus = "WIN";
      }
    }

    return {
      components: this.displayBoard, 
      content: '\u200b', 
      endStatus: endStatus
    };
  }

  protected messageToDo(): DjsInputResult {
    return {
      components: [this.controller], 
      content: '\u200b', 
      endStatus: ""
    };
  }

  protected async update(result: DjsInputResult): Promise<DjsInputResult> {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }

    this.playerManager.next();
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

  private get answerContent(): string {
    this.answered = true;
    let content = '';
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++)
        content += this.strings.answerSymbols[this.answer[i][j] ? 1 : 0];
      content += '\n';
    }
    return content;
  }

  private getBoardButtons(): MessageButton[][] {
    const board: MessageButton[][] = [];
    for (let i = 0; i < this.boardSize; i++) {
      board.push([]);
      for (let j = 0; j < this.boardSize; j++) {
        board[i].push(new MessageButton()
          .setCustomId(`HZG_PLAY_${i}_${j}`)
          .setLabel('\u200b')
          .setStyle("PRIMARY")
        );
      }
    }
    return board;
  }
}