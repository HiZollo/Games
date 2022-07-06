import { ButtonInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { DjsGameWrapper } from './DjsGameWrapper';
import { HZGError, ErrorCodes } from '../errors';
import { Tofe } from '../games';
import { Player } from '../struct';
import { TofeDirections } from '../types/enums';
import { DjsTofeOptions, TofeStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { tofe } from '../util/strings.json';

export class DjsTofe extends DjsGameWrapper {
  public strings: TofeStrings;

  protected game: Tofe;
  protected inputMode: number;
  protected boardButtons: MessageButton[][];

  
  constructor({ players, hardMode, source, time, strings }: DjsTofeOptions) {
    super({ source, time });
    this.game = new Tofe({ players, hardMode });

    this.strings = overwrite(JSON.parse(JSON.stringify(tofe)), strings);

    this.inputMode = 0b10;
    this.buttonFilter = this.buttonFilter.bind(this);
    this.messageFilter = this.messageFilter.bind(this);
    
    this.boardButtons = [];
  }

  async initialize(): Promise<void> {
    await super.initialize(
      { content: format(this.strings.score, { score: this.game.score }), components: [] }, 
      { content: '\u200b', components: this.newController }
    );

    for (let i = 0; i < this.game.boardSize; i++) {
      this.boardButtons.push([]);
      for (let j = 0; j < this.game.boardSize; j++) {
        this.boardButtons[i][j] = new MessageButton()
          .setCustomId(`HZG_PLAY_${i}_${j}`)
          .setLabel(`${this.game.board[i][j] ?? '\u200b'}`)
          .setStyle("PRIMARY")
          .setDisabled(true);
      }
    }

    await this.mainMessage?.edit({ components: this.displayBoard });
  }

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.game.status.now) {
      case "WIN":
        return format(message.win, { player: `<@${this.game.winner?.id}>` });
      case "LOSE":
        return format(message.lose, { player: `<@${this.game.loser?.id}>` });
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


  protected buttonFilter(i: ButtonInteraction): boolean {
    return i.customId.startsWith("HZG") && i.user.id === this.game.playerManager.nowPlayer.id;
  }

  protected messageFilter(): boolean {
    return false;
  }

  protected idleToDo(nowPlayer: Player): DjsInputResult {
    nowPlayer.status.set("IDLE");
    return {};
  }

  protected buttonToDo(nowPlayer: Player, input: string): DjsInputResult {
    const args = input.split('_');
    let endStatus = "";
    if (args[1] === "CTRL") {
      if (args[2] === 'leave') {
        this.game.playerManager.kick(nowPlayer.id);
      }
      else {
        let success = false;
        switch (args[2]) {
          case 'up':
            success = this.game.operate(TofeDirections.Up);
            break;
          case 'down':
            success = this.game.operate(TofeDirections.Down);
            break;
          case 'left':
            success = this.game.operate(TofeDirections.Left);
            break;
          case 'right':
            success = this.game.operate(TofeDirections.Right);
            break;
        }

        nowPlayer.status.set("PLAYING");
        if (success) {
          nowPlayer.addStep();
        }
        if (this.game.win()) {
          this.game.winner = nowPlayer;
          endStatus = "WIN";
        }
        else if (this.game.lose()) {
          this.game.loser = nowPlayer;
          endStatus = "LOSE";
        }
      }
    }
    else {
      throw new HZGError(ErrorCodes.InvalidButtonInteraction);
    }

    return {
      content: format(this.strings.score, { score: this.game.score }), 
      components: this.displayBoard, 
      endStatus: endStatus
    };
  }

  protected messageToDo(): DjsInputResult {
    return {};
  }

  protected async botMove(): Promise<DjsInputResult> {
    throw new HZGError(ErrorCodes.BotsNotAllowed);
  }

  protected async update(result: DjsInputResult): Promise<DjsInputResult> {
    if (!this.mainMessage) {
      throw new HZGError(ErrorCodes.InvalidMainMessage);
    }

    this.game.playerManager.next();
    await this.mainMessage.edit(result).catch(() => {
      result.endStatus = "DELETED";
    });
    return result;
  }

  protected async end(status: string): Promise<void> {
    this.game.end(status);

    await this.subMessage?.delete().catch(() => {});
  }


  private get newController(): MessageActionRow[] {
    return [new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_empty_1')
        .setLabel('\u200b')
        .setStyle("SECONDARY")
        .setDisabled(true), 
      new MessageButton()
        .setCustomId('HZG_CTRL_up')
        .setLabel(this.strings.controller.up)
        .setStyle("PRIMARY"), 
      new MessageButton()
        .setCustomId('HZG_CTRL_empty_2')
        .setLabel('\u200b')
        .setStyle("SECONDARY")
        .setDisabled(true), 
    ), new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_left')
        .setLabel(this.strings.controller.left)
        .setStyle("PRIMARY"), 
      new MessageButton()
        .setCustomId('HZG_CTRL_down')
        .setLabel(this.strings.controller.down)
        .setStyle("PRIMARY"), 
      new MessageButton()
        .setCustomId('HZG_CTRL_right')
        .setLabel(this.strings.controller.right)
        .setStyle("PRIMARY"), 
    ), new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_leave')
        .setLabel(this.strings.controller.leave)
        .setStyle("DANGER")
    )]
  }

  private get displayBoard(): MessageActionRow[] {
    let result = [];
    for (let i = 0; i < this.game.boardSize; i++) {
      result.push(new MessageActionRow());
      for (let j = 0; j < this.game.boardSize; j++) {
        this.boardButtons[i][j].setLabel(`${this.game.board[i][j] ?? '\u200b'}`);
        result[i].addComponents(this.boardButtons[i][j]);
      }
    }
    return result;
  }
}