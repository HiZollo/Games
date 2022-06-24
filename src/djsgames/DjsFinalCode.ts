import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { FinalCodeInterface, DjsFinalCodeOptions, FinalCodeStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { GameUtil } from '../util/GameUtil';
import { finalCode } from '../util/strings.json';
import { Player } from '../struct/Player';
import { Range } from '../struct/Range';
import { DjsGame } from './DjsGame';

export class DjsFinalCode extends DjsGame implements FinalCodeInterface {
  public answer: number;
  public range: Range;

  public strings: FinalCodeStrings;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  protected inputMode: number;


  constructor({ range = new Range(1, 1000), players, source, strings, time }: DjsFinalCodeOptions) {
    super({ players, playerCountRange: new Range(1, Infinity), source, time });
    if (range.interval <= 2) {
      throw new Error('The length of the interval should be larger than 2.');
    }

    this.answer = 0;
    this.range = range;

    this.strings = overwrite(JSON.parse(JSON.stringify(finalCode)), strings);
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

    this.answer = GameUtil.randomInt(this.range.min + 1, this.range.max - 1);
    let content = format(this.strings.interval, { min: this.range.min, max: this.range.max }) + '\n';
                + format(this.strings.nowPlayer, { player: `<@${this.playerManager.nowPlayer.id}>` });

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

  guess(query: number): 1 | 0 | -1 {
    if (query !== ~~query) {
      throw new Error(`The query should be an integer.`);
    }

    if (this.range.inOpenRange(query)) {
      if (query <= this.answer) this.range.min = query;
      if (query >= this.answer) this.range.max = query;
    }

    if (query > this.answer) return 1
    if (query < this.answer) return -1
    return 0;
  }

  win() {
    return this.range.min === this.range.max;
  }

  async end(status: string): Promise<void> {
    super.end(status);

    const content = format(this.strings.interval, { min: this.range.min, max: this.range.max })
    await this.mainMessage?.edit({ content: content, components: [] }).catch(() => {});
  }

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.status.now) {
      case "WIN":
        return format(message.win, { player: `<@${this.winner?.id}>`, answer: this.answer });
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

  protected messageFilter = (m: Message): boolean => {
    if (m.author.id !== this.playerManager.nowPlayer.id) return false;

    const query = +m.content;
    if (isNaN(query) || query !== ~~query) return false;
    return this.range.inOpenRange(query);
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
      content: format(this.strings.previous.leaving, { player: nowPlayer.username }) + '\n', 
    };
  }

  protected messageToDo(nowPlayer: Player, input: string): DjsInputResult {
    nowPlayer.status.set("PLAYING");
    nowPlayer.addStep();

    const query = +input;
    const result = this.guess(query);
    let content = '';
    let endStatus = "";

    if (result === 0) {
      this.winner = nowPlayer;
      endStatus = "WIN";
    }
    else {
      content = result > 0 ?
        format(this.strings.previous.tooLarge, { query }) + '\n' :
        format(this.strings.previous.tooSmall, { query }) + '\n';
    }

    return {
      content: content ? content : '\u200b', 
      endStatus: endStatus
    };
  }

  protected async update(result: DjsInputResult): Promise<DjsInputResult> {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }

    this.playerManager.next();
    result.content += format(this.strings.interval, { min: this.range.min, max: this.range.max }) + '\n';
    result.content += format(this.strings.nowPlayer, { player: `<@${this.playerManager.nowPlayer.id}>` });
    await this.mainMessage.edit(result).catch(() => {
      result.endStatus = "DELETED";
    });
    return result;
  }
}