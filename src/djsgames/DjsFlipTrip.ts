import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { FlipTripInterface, DjsFlipTripOptions, FlipTripStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { flipTrip } from '../util/strings.json';
import { Player } from '../struct/Player';
import { Range } from '../struct/Range';
import { DjsGame } from './DjsGame';

const MAX_BUTTON_PER_ROW = 5;

export class DjsFlipTrip extends DjsGame implements FlipTripInterface {
  public boardSize: number;
  public state: number;
  public appearedStates: number[];

  public strings: FlipTripStrings;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  private boardButtons: MessageActionRow[];
  protected permutationCount: number;
  protected inputMode: number;

  
  constructor({ boardSize = 3, players, source, strings, time }: DjsFlipTripOptions) {
    super({ playerManagerOptions: { players, playerCountRange: new Range(1, Infinity) }, source, time });
    if (boardSize > 10) {
      throw new Error('The size of the board should be at most 10.');
    }

    this.boardSize = boardSize;
    this.state = 0;
    this.appearedStates = [];
    this.permutationCount = 2 ** boardSize;

    this.strings = overwrite(JSON.parse(JSON.stringify(flipTrip)), strings);
    this.boardButtons = [];
    this.controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_stop')
        .setLabel(this.strings.controller.stop)
        .setStyle("DANGER")
    );

    this.mainMessage = undefined;
    this.controllerMessage = undefined;

    this.inputMode = 0b10;
  }

  async initialize(): Promise<void> {
    super.initialize();

    for (let i = 0; i < this.permutationCount; i++)
      this.appearedStates.push(0);
    this.appearedStates[this.state] = 1;
    
    for (let i = 0; i < this.boardSize; i++) {
      if (i % MAX_BUTTON_PER_ROW === 0) {
        this.boardButtons.push(new MessageActionRow());
      }

      this.boardButtons[~~(i / MAX_BUTTON_PER_ROW)].addComponents(
        new MessageButton()
          .setCustomId(`HZG_PLAY_${this.boardSize - 1 - i}`)
          .setLabel(`${this.boardSize - i}`)
          .setStyle("PRIMARY")
      );
    }

    if ('editReply' in this.source) {
      if (!this.source.inCachedGuild()) { // type guard
        throw new Error('The guild is not cached.');
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

  flip(location: number): boolean {
    this.state ^= (1 << location);

    if (this.appearedStates[this.state]) {
      return false;
    }
    this.appearedStates[this.state] = 1;
    return true;
  }

  win(): boolean {
    return this.playerManager.totalSteps === this.permutationCount - 1;
  }

  async end(status: string): Promise<void> {
    super.end(status);

    await this.mainMessage?.edit({ components: [] }).catch(() => {});
  }

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.status.now) {
      case "WIN":
        return format(message.win, { player: `<@${this.winner?.id}>`, size: this.boardSize });
      case "LOSE":
        return format(message.lose, { player: `<@${this.loser?.id}>`, state: this.pieces, perm: this.permutationCount - this.playerManager.totalSteps });
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
      content: this.boardContent, 
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

    let endStatus = "";
    if (args[1] === "CTRL") {
      nowPlayer.status.set("LEAVING");
    }
    else if (args[1] === "PLAY") {
      nowPlayer.status.set("PLAYING");
      nowPlayer.addStep();

      const legal = this.flip(parseInt(args[2], 10));

      if (!legal) {
        this.loser = nowPlayer;
        endStatus = "LOSE";
      }
      else if (this.win()) {
        this.winner = nowPlayer;
        endStatus = "WIN";
      }
    }

    return {
      content: this.boardContent, 
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
    await this.mainMessage.edit(result).catch(() => {
      result.endStatus = "DELETED";
    });
    return result;
  }


  private get boardContent(): string {
    let boardContent = '';
    for (let i = this.boardSize - 1; i >= 0; i--) {
      boardContent += this.strings.numbers[i];
    }
    boardContent += '\n';
    boardContent += this.pieces;

    return boardContent;
  }

  private get pieces() {
    let result = '';
    for (let i = this.boardSize - 1; i >= 0; i--) {
      result += this.strings.pieces[(this.state & (1 << i)) ? 1 : 0];
    }
    return result;
  }
}