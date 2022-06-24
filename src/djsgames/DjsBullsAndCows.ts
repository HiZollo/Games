import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { BullsAndCowsInterface, DjsBullsAndCowsOptions, BullsAndCowsResult, BullsAndCowsStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { GameUtil } from '../util/GameUtil';
import { bullsAndCows } from '../util/strings.json';
import { Player } from '../struct/Player';
import { Range } from '../struct/Range';
import { DjsGame } from './DjsGame';

export class DjsBullsAndCows extends DjsGame implements BullsAndCowsInterface {
  public answer: number[];
  public answerLength: number;
  public numberCount: number;
  public hardMode: boolean;

  public strings: BullsAndCowsStrings;
  public content: string;
  public gameHeader: string;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  protected inputMode: number;
  

  constructor({ answerLength = 4, hardMode = false, players, source, strings, time }: DjsBullsAndCowsOptions) {
    super({ players, playerCountRange: new Range(1, 1), source, time });

    this.answer = []
    this.answerLength = answerLength;
    this.numberCount = 10;
    this.hardMode = hardMode;

    this.strings = overwrite(JSON.parse(JSON.stringify(bullsAndCows)), strings);
    this.content = format(this.strings.initial, { player: this.playerManager.nowPlayer.username });
    this.gameHeader = this.content;
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
    super.initialize();

    const numbers = [];
    for (let i = 0; i < this.numberCount; i++) {
      numbers.push(i)
    }

    GameUtil.shuffle(numbers);

    for (let i = 0; i < this.answerLength; i++) {
      this.answer.push(numbers[i]);
    }

    if ('editReply' in this.source) {
      if (!this.source.inCachedGuild()) { // type guard
        throw new Error('The guild is not cached.');
      }
      if (!this.source.deferred) {
        await this.source.deferReply();
      }

      this.mainMessage = await this.source.editReply({ content: this.content, components: [this.controller] });
      this.controllerMessage = this.mainMessage;
    }
    else {
      this.mainMessage = await this.source.channel.send({ content: this.content, components: [this.controller] });
      this.controllerMessage = this.mainMessage;
    }
  }

  guess(query: number[]): BullsAndCowsResult {
    if (query.length !== this.answerLength) {
      throw new Error(`The number count in query ${query} is different with the answer's length (${this.answerLength}).`);
    }
    if ((new Set(query)).size !== query.length) {
      throw new Error(`There are duplicated numbers in query ${query}.`);
    }

    let result: BullsAndCowsResult = { a: 0, b: 0 };
    for (let i = 0; i < this.answerLength; i++)
      for (let j = 0; j < this.answerLength; j++)
        if (query[i] == this.answer[j]) {
          if (i === j) result.a++;
          else result.b++;
        }

    return result;
  }

  win(result: BullsAndCowsResult): boolean {
    return result.a === this.answerLength;
  }

  async end(status: string): Promise<void> {
    super.end(status);
    await this.mainMessage?.edit({ components: [] }).catch(() => {});
  }

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.status.now) {
      case "WIN":
        return format(message.win, { player: `<@${this.winner?.id}>`, answer: this.answer.join('') });
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

  protected messageFilter = (m: Message<boolean>): boolean => {
    if (m.author.id !== this.playerManager.nowPlayer.id) return false;

    if (m.content.length !== this.answerLength) return false;
    if (!/^\d+$/.test(m.content)) return false;
    const query = this.getQuery(m.content);
    return (new Set(query)).size === m.content.length;
  }

  protected idleToDo(nowPlayer: Player): DjsInputResult {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }

    nowPlayer.status.set("IDLE");
    return {
      content: this.hardMode ? this.gameHeader : this.content, 
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
      content: this.hardMode ? this.gameHeader : this.content, 
    };
  }

  protected messageToDo(nowPlayer: Player, input: string): DjsInputResult {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }

    nowPlayer.status.set("PLAYING");
    nowPlayer.addStep();

    const query = this.getQuery(input);
    const status = this.guess(query);
    let endStatus = "";
    if (this.win(status)) {
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

  protected async update(result: DjsInputResult): Promise<DjsInputResult> {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }

    this.playerManager.next();
    this.mainMessage.edit(result).catch(() => {
      result.endStatus = "DELETED";
    });
    return result;
  }

  private getQuery(content: string): number[] {
    const query = [];
    for (let c of content) {
      query.push(+c);
    }
    return query;
  }
}