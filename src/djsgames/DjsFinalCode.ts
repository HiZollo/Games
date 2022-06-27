import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { DjsGameWrapper } from './DjsGameWrapper';
import { HZGError, ErrorCodes } from '../errors';
import { FinalCode } from '../games/FinalCode';
import { Player } from '../struct/Player';
import { DjsFinalCodeOptions, FinalCodeStrings, DjsInputResult } from '../types/interfaces';
import { AI } from '../util/AI/AI';
import { format, overwrite } from '../util/Functions';
import { finalCode } from '../util/strings.json';

export class DjsFinalCode extends DjsGameWrapper {
  public strings: FinalCodeStrings;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  protected game: FinalCode;
  protected inputMode: number;


  constructor({ players, range, source, time, strings }: DjsFinalCodeOptions) {
    super({ source, time });
    this.game = new FinalCode({ players, range });

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
    this.buttonFilter = this.buttonFilter.bind(this);
    this.messageFilter = this.messageFilter.bind(this);
  }

  async initialize(): Promise<void> {
    this.game.initialize();

    const content = format(this.strings.interval, { min: this.game.range.min, max: this.game.range.max }) + '\n'
                  + format(this.strings.nowPlayer, { player: `<@${this.game.playerManager.nowPlayer.id}>` });

    if ('editReply' in this.source) {
      if (!this.source.inCachedGuild()) { // type guard
        throw new HZGError(ErrorCodes.GuildNotCached);
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

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.game.status.now) {
      case "WIN":
        return format(message.win, { player: `<@${this.game.winner?.id}>`, answer: this.game.answer });
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

    const query = +m.content;
    if (isNaN(query) || query !== ~~query) return false;
    return this.game.range.inOpenRange(query);
  }

  protected idleToDo(nowPlayer: Player): DjsInputResult {
    if (!this.mainMessage) {
      throw new HZGError(ErrorCodes.InvalidMainMessage);
    }

    nowPlayer.status.set("IDLE");
    return {
      content: format(this.strings.previous.idle, { player: nowPlayer.username }) + '\n', 
    };
  }

  protected buttonToDo(nowPlayer: Player, input: string): DjsInputResult {
    if (!this.mainMessage) {
      throw new HZGError(ErrorCodes.InvalidMainMessage);
    }
    const args = input.split('_');

    if (args[0] !== "HZG") {
      throw new HZGError(ErrorCodes.InvalidButtonInteraction);
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
    const result = this.game.guess(query);
    let content = '\u200b';
    let endStatus = "";

    if (result === 0) {
      this.game.winner = nowPlayer;
      endStatus = "WIN";
    }
    else {
      content = result > 0 ?
        format(this.strings.previous.tooLarge, { query }) + '\n' :
        format(this.strings.previous.tooSmall, { query }) + '\n';
    }

    return {
      content: content, 
      endStatus: endStatus
    };
  }

  protected async botMove(bot: Player): Promise<DjsInputResult> {
    bot.addStep();

    const query = await AI.FinalCode(this.game.range);
    const result = this.game.guess(query);
    let content = '\u200b';
    let endStatus = "";

    if (result === 0) {
      this.game.winner = bot;
      endStatus = "WIN";
    }
    else {
      content = result > 0 ?
        format(this.strings.previous.tooLarge, { query }) + '\n' :
        format(this.strings.previous.tooSmall, { query }) + '\n';
    }

    return {
      content: content, 
      endStatus: endStatus
    };
  }

  protected async update(result: DjsInputResult): Promise<DjsInputResult> {
    if (!this.mainMessage) {
      throw new HZGError(ErrorCodes.InvalidMainMessage);
    }

    this.game.playerManager.next();
    result.content += format(this.strings.interval, { min: this.game.range.min, max: this.game.range.max }) + '\n';
    result.content += format(this.strings.nowPlayer, { player: `<@${this.game.playerManager.nowPlayer.id}>` });
    await this.mainMessage.edit(result).catch(() => {
      result.endStatus = "DELETED";
    });
    return result;
  }

  protected async end(status: string): Promise<void> {
    this.game.end(status);

    const content = format(this.strings.interval, { min: this.game.range.min, max: this.game.range.max })
    await this.mainMessage?.edit({ content: content, components: [] }).catch(() => {});
  }
}