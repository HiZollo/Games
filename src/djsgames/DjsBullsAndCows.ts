import { Message, MessageActionRow, MessageButton } from 'discord.js';
import { DjsGameWrapper } from './DjsGameWrapper';
import { HZGError, ErrorCodes } from '../errors';
import { BullsAndCows } from '../games';
import { Player } from '../struct';
import { DjsBullsAndCowsOptions, BullsAndCowsStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { bullsAndCows } from '../util/strings.json';

const MAX_CONTENT_LENGTH = 2000;

export class DjsBullsAndCows extends DjsGameWrapper {
  public hardMode: boolean;

  public strings: BullsAndCowsStrings;
  public content: string;
  public gameHeader: string;

  protected game: BullsAndCows;
  protected inputMode: number;
  

  constructor({ players, answerLength = 4, source, time, hardMode = false, strings }: DjsBullsAndCowsOptions) {
    super({ source, time });
    this.game = new BullsAndCows({ players, answerLength });
    this.hardMode = hardMode;

    this.strings = overwrite(JSON.parse(JSON.stringify(bullsAndCows)), strings);
    this.content = format(this.strings.initial, { player: this.game.playerManager.nowPlayer.username });
    this.gameHeader = this.content;

    this.inputMode = 0b01;
    this.buttonFilter = this.buttonFilter.bind(this);
    this.messageFilter = this.messageFilter.bind(this);
  }

  async initialize(): Promise<void> {
    const components = [new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_leave')
        .setLabel(this.strings.controller.leave)
        .setStyle("DANGER")
    )];
    await super.initialize({ content: this.content, components });
  }

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.game.status.now) {
      case "WIN":
        return format(message.win, { player: `<@${this.winner?.id}>`, answer: this.game.answer.join('') });
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


  protected buttonFilter(): boolean {
    return false;
  }

  protected messageFilter(m: Message): boolean {
    if (m.author.id !== this.game.playerManager.nowPlayer.id) return false;

    if (m.content.length !== this.game.answerLength) return false;
    if (!/^\d+$/.test(m.content)) return false;
    const query = this.getQuery(m.content);
    return (new Set(query)).size === m.content.length;
  }

  protected idleToDo(nowPlayer: Player): DjsInputResult {
    nowPlayer.status.set("IDLE");
    return {};
  }

  protected buttonToDo(): DjsInputResult {
    throw new HZGError(ErrorCodes.InvalidButtonInteraction);
  }

  protected messageToDo(nowPlayer: Player, input: string): DjsInputResult {
    nowPlayer.status.set("PLAYING");
    nowPlayer.addStep();

    const query = this.getQuery(input);
    const status = this.game.guess(query);
    let endStatus = "";
    if (this.game.win(status)) {
      this.winner = nowPlayer;
      endStatus = "WIN";
    }

    let content = this.hardMode ? this.gameHeader : this.content;
    content += '\n' + format(this.strings.query, { a: status.a, b: status.b, query: input });
    this.content += '\n' + format(this.strings.query, { a: status.a, b: status.b, query: input });

    return {
      content: content, 
      endStatus: endStatus
    };
  }

  protected async botMove(): Promise<DjsInputResult> {
    throw new HZGError(ErrorCodes.BotsNotAllowed);
  }

  protected async update(result: DjsInputResult): Promise<DjsInputResult> {
    if (!this.mainMessage) {
      throw new HZGError(ErrorCodes.InvalidMainMessage);
    }

    this.game.playerManager.next();
    while (result.content && result.content.length > MAX_CONTENT_LENGTH) {
      const matches = result.content.match(/([\s\S]*?)\n([\s\S]*?)\n([\s\S]*)/);
      if (matches) {
        result.content = matches[1] + '\n' + matches[3];
      }
    }
    await this.mainMessage.edit(result).catch(() => {
      result.endStatus = "DELETED";
    });
    return result;
  }

  protected async end(status: string): Promise<void> {
    this.game.end(status);
    await this.mainMessage?.edit({ components: [] }).catch(() => {});
  }
  

  private getQuery(content: string): number[] {
    const query = [];
    for (let c of content) {
      query.push(+c);
    }
    return query;
  }
}