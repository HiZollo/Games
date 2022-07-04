import { ButtonInteraction, Client, Collection, CommandInteraction, Message, MessageEmbed } from 'discord.js';
import { HZGError, ErrorCodes } from '../errors';
import { Game, Player } from '../struct';
import { DjsGameWrapperOptions, DjsInputResult, GameStrings } from '../types/interfaces';
import { fixedDigits, format, sleep } from '../util/Functions';

export abstract class DjsGameWrapper {
  public client: Client;
  public source: CommandInteraction | Message;
  public time: number;

  // actual displaying things
  public abstract strings: GameStrings;
  public abstract mainMessage: Message | void;
  public abstract controllerMessage: Message | void;
  public abstract initialize(): Promise<void>;
  public abstract getEndContent(): string;
  
  // logic implementation
  protected abstract game: Game;
  protected abstract inputMode: number;
  protected abstract buttonFilter(i: ButtonInteraction): boolean;
  protected abstract messageFilter(m: Message): boolean;
  protected abstract idleToDo(nowPlayer: Player): DjsInputResult;
  protected abstract buttonToDo(nowPlayer: Player, input: string, interaction?: ButtonInteraction): DjsInputResult;
  protected abstract messageToDo(nowPlayer: Player, input: string, message?: Message): DjsInputResult;
  protected abstract botMove(bot: Player): Promise<DjsInputResult>;
  protected abstract update(result: DjsInputResult): Promise<DjsInputResult>;
  protected abstract end(status: string): Promise<void>;


  constructor({ source, time = 60e3 }: DjsGameWrapperOptions) {
    if (!source.channel) {
      throw new HZGError(ErrorCodes.InvalidChannel);
    }

    this.time = time;

    this.client = source.client;
    this.source = source;
  }

  // main logic
  private async run(nowPlayer: Player): Promise<void> {
    let result: DjsInputResult;

    if (nowPlayer.bot) {
      result = await this.botMove(nowPlayer);
    }
    else {
      const input = await this.getInput();
      const parsedInput = this.parseInput(input);
  
      if (input === null || parsedInput === null) {
        result = this.idleToDo(nowPlayer);
      }
      else if ('customId' in input) {
        result = this.buttonToDo(nowPlayer, parsedInput, input);
      }
      else {
        result = this.messageToDo(nowPlayer, parsedInput, input);
      }
    }

    result = await this.update(result);
    if (result.endStatus) {
      await this.end(result.endStatus);
    }
  }

  async start(): Promise<void> {
    let nowPlayer: Player = this.game.playerManager.nowPlayer;
    while (this.game.ongoing && this.game.playerManager.alive) {
      nowPlayer = this.game.playerManager.nowPlayer;
      await this.run(nowPlayer);
    }

    if (this.game.ongoing) {
      switch (nowPlayer.status.now) {
        case "IDLE":
          return this.end("IDLE");
        case "DELETED":
          return this.end("DELETED");
        default:
          return this.end("STOPPED");
      }
    }
  }

  async conclude(): Promise<void> {
    if (this.game.ongoing) {
      throw new HZGError(ErrorCodes.GameNotEnded);
    }

    const content = this.getEndContent();
    const embeds = [this.getEndEmbed()];
    await this.mainMessage?.reply({ content, embeds }).catch(() => {
      this.source.channel?.send({ content, embeds });
    });
  }


  private getEndEmbed(): MessageEmbed {
    if (this.game.duration == null) {
      throw new HZGError(ErrorCodes.GameNotEnded);
    }
  
    const message = this.strings.endMessages;
    const min = ~~(this.game.duration/60000);
    const sec = fixedDigits(Math.round(this.game.duration/1000) % 60, 2);
  
    const embed = new MessageEmbed()
      .setAuthor({ name: format(message.gameStats.header, { game: this.strings.name }), iconURL: this.client.user?.displayAvatarURL() })
      .setColor(0x000000)
      .setDescription(format(message.gameStats.message, { min, sec, step: this.game.playerManager.totalSteps }));
  
    if (this.game.playerManager.playerCount > 1) {
      for (const player of this.game.playerManager.players) {
        const m = ~~(player.time/60000);
        const s = fixedDigits(Math.round(player.time/1000) % 60, 2);
        embed.addField(player.username, format(message.playerStats.message, { min: m, sec: s, step: player.steps }), true);
      }
    }
  
    return embed;
  }

  private async getInput(): Promise<ButtonInteraction | Message | null> {
    // Since awaitMessageComponent() may reject, a must-resolving Promise is needed
    const promises: (Promise<ButtonInteraction | Collection<string, Message> | null> | void)[] = [sleep(this.time, null)];

    // button input from controller message
    promises.push(this.controllerMessage?.awaitMessageComponent({
      filter: this.buttonFilter,
      componentType: "BUTTON",
      time: this.time
    }));
  
    // button input from main message
    if (this.inputMode & 0b10)
      promises.push(this.mainMessage?.awaitMessageComponent({
        filter: this.buttonFilter,
        componentType: "BUTTON",
        time: this.time
      }));
  
    // message input from same channel
    if ((this.inputMode & 0b01) && this.source.channel)
      promises.push(this.source.channel.awaitMessages({
        filter: this.messageFilter,
        max: 1,
        time: this.time
      }));
  
    const input = await Promise.any(promises);
    if (input == null) {
      return null;
    }
    if ('update' in input) {
      await input.update({});
      return input;
    }

    const message = input.first();
    if (!message) {
      return null;
    }
    await message.delete().catch(() => {});
    return message;
  }

  private parseInput(input: ButtonInteraction | Message | null): string | null {
    if (input === null) {
      return null;
    }
    if ('customId' in input) {
      return input.customId;
    }
    if ('content' in input) {
      return input.content;
    }
    return null;
  }
}
