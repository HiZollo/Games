import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { DjsGameWrapper } from './DjsGameWrapper';
import { BullsAndCows } from '../games/BullsAndCows';
import { Player } from '../struct/Player';
import { DjsBullsAndCowsOptions, BullsAndCowsStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { bullsAndCows } from '../util/strings.json';

export class DjsBullsAndCows extends DjsGameWrapper {
  public hardMode: boolean;

  public strings: BullsAndCowsStrings;
  public content: string;
  public gameHeader: string;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  protected game: BullsAndCows;
  protected inputMode: number;
  

  constructor({ players, answerLength = 4, source, time, hardMode = false, strings }: DjsBullsAndCowsOptions) {
    super({ source, time });
    this.game = new BullsAndCows({ players, answerLength });
    this.hardMode = hardMode;

    this.strings = overwrite(JSON.parse(JSON.stringify(bullsAndCows)), strings);
    this.content = format(this.strings.initial, { player: this.game.playerManager.nowPlayer.username });
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
    this.buttonFilter = this.buttonFilter.bind(this);
    this.messageFilter = this.messageFilter.bind(this);
  }

  async initialize(): Promise<void> {
    this.game.initialize();

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

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.game.status.now) {
      case "WIN":
        return format(message.win, { player: `<@${this.game.winner?.id}>`, answer: this.game.answer.join('') });
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
    return i.user.id === this.game.playerManager.nowPlayer.id;
  }

  protected messageFilter(m: Message): boolean {
    if (m.author.id !== this.game.playerManager.nowPlayer.id) return false;

    if (m.content.length !== this.game.answerLength) return false;
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
    const status = this.game.guess(query);
    let endStatus = "";
    if (this.game.win(status)) {
      this.game.winner = nowPlayer;
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
  

  private getQuery(content: string): number[] {
    const query = [];
    for (let c of content) {
      query.push(+c);
    }
    return query;
  }
}