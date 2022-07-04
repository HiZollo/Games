import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { DjsGameWrapper } from './DjsGameWrapper';
import { HZGError, ErrorCodes } from '../errors';
import { FlipTrip } from '../games';
import { Player } from '../struct';
import { DjsFlipTripOptions, FlipTripStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { flipTrip } from '../util/strings.json';

const MAX_BUTTON_PER_ROW = 5;

export class DjsFlipTrip extends DjsGameWrapper {
  public strings: FlipTripStrings;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  protected game: FlipTrip;
  protected inputMode: number;
  protected boardButtons: MessageActionRow[];

  
  constructor({ players, boardSize, source, time, strings }: DjsFlipTripOptions) {
    super({ source, time });
    this.game = new FlipTrip({ players, boardSize });

    this.strings = overwrite(JSON.parse(JSON.stringify(flipTrip)), strings);
    this.controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_leave')
        .setLabel(this.strings.controller.leave)
        .setStyle("DANGER")
    );

    this.mainMessage = undefined;
    this.controllerMessage = undefined;

    this.inputMode = 0b10;
    this.buttonFilter = this.buttonFilter.bind(this);
    this.messageFilter = this.messageFilter.bind(this);

    this.boardButtons = [];
  }

  async initialize(): Promise<void> {
    this.game.initialize();
    
    for (let i = 0; i < this.game.boardSize; i++) {
      if (i % MAX_BUTTON_PER_ROW === 0) {
        this.boardButtons.push(new MessageActionRow());
      }
      this.boardButtons[~~(i / MAX_BUTTON_PER_ROW)].addComponents(
        new MessageButton()
          .setCustomId(`HZG_PLAY_${this.game.boardSize - 1 - i}`)
          .setLabel(`${this.game.boardSize - i}`)
          .setStyle("PRIMARY")
      );
    }

    if ('editReply' in this.source) {
      if (!this.source.inCachedGuild()) { // type guard
        throw new HZGError(ErrorCodes.GuildNotCached);
      }
      if (!this.source.deferred) {
        await this.source.deferReply();
      }
      this.mainMessage = await this.source.editReply({ content: this.boardContent, components: [...this.boardButtons, this.controller] });
      this.controllerMessage = this.mainMessage;
    }
    else {
      this.mainMessage = await this.source.channel.send({ content: this.boardContent, components: [...this.boardButtons, this.controller] });
      this.controllerMessage = this.mainMessage;
    }
  }

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.game.status.now) {
      case "WIN":
        return format(message.win, { player: `<@${this.game.winner?.id}>`, size: this.game.boardSize });
      case "LOSE":
        return format(message.lose, { player: `<@${this.game.loser?.id}>`, state: this.pieces, perm: this.game.permutationCount - this.game.playerManager.totalSteps });
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
    return {
      content: this.boardContent, 
    };
  }

  protected buttonToDo(nowPlayer: Player, input: string): DjsInputResult {
    const args = input.split('_');
    let endStatus = "";
    if (args[1] === "CTRL" && args[2] === "leave") {
      this.game.playerManager.kick(nowPlayer.id);
    }
    else if (args[1] === "PLAY") {
      nowPlayer.status.set("PLAYING");
      nowPlayer.addStep();

      const legal = this.game.flip(parseInt(args[2], 10));

      if (!legal) {
        this.game.loser = nowPlayer;
        endStatus = "LOSE";
      }
      else if (this.game.win()) {
        this.game.winner = nowPlayer;
        endStatus = "WIN";
      }
    }
    else {
      throw new HZGError(ErrorCodes.InvalidButtonInteraction);
    }

    return {
      content: this.boardContent, 
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

    await this.mainMessage?.edit({ components: [] }).catch(() => {});
  }


  private get boardContent(): string {
    let boardContent = '';
    for (let i = this.game.boardSize - 1; i >= 0; i--) {
      boardContent += this.strings.numbers[i];
    }
    boardContent += '\n';
    boardContent += this.pieces;

    return boardContent;
  }

  private get pieces() {
    let result = '';
    for (let i = this.game.boardSize - 1; i >= 0; i--) {
      result += this.strings.pieces[(this.game.state & (1 << i)) ? 1 : 0];
    }
    return result;
  }
}