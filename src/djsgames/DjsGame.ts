import { ButtonInteraction, Client, CommandInteraction, InteractionReplyOptions, Message, MessageActionRow, MessageEmbed } from 'discord.js';
import { DjsGameOptions, DjsInputResult, GameStrings } from '../types/interfaces';
import { Game } from '../struct/Game';
import { Player } from '../struct/Player';
import { fixedDigits, format, sleep } from '../util/Functions';

export abstract class DjsGame extends Game {
  public client: Client;
  public source: CommandInteraction | Message;
  public time: number;

  // actual displaying things
  public abstract strings: GameStrings;
  public abstract mainMessage: Message | void;
  public abstract controller: MessageActionRow;
  public abstract controllerMessage: Message | void;
  public abstract getEndContent(): string;
  
  // logic implementation
  protected abstract inputMode: number;
  protected abstract buttonFilter(i: ButtonInteraction): boolean;
  protected abstract messageFilter(m: Message): boolean;
  protected abstract idleToDo(nowPlayer: Player): DjsInputResult;
  protected abstract buttonToDo(nowPlayer: Player, input: string): DjsInputResult;
  protected abstract messageToDo(nowPlayer: Player, input: string): DjsInputResult;
  protected abstract update(result: DjsInputResult): Promise<DjsInputResult>;


  constructor({ playerManagerOptions, source, time = 60e3, gameStatus = [] }: DjsGameOptions) {
    super({ playerManagerOptions, gameStatus });
    if (!source.channel) {
      throw new Error('This channel is invalid.');
    }

    this.time = time;

    this.client = source.client;
    this.source = source;
  }

  // main logic
  private async run(nowPlayer: Player): Promise<void> {
    const input = await this.getInput();
    let result: DjsInputResult;

    if (input === null) {
      result = this.idleToDo(nowPlayer);
    }
    else if (input.startsWith("HZG_")) {
      result = this.buttonToDo(nowPlayer, input);
    }
    else {
      result = this.messageToDo(nowPlayer, input);
    }

    result = await this.update(result);

    if (result.endStatus) {
      this.end(result.endStatus);
    }
  }

  async start(): Promise<void> {
    let nowPlayer: Player = this.playerManager.nowPlayer;
    while (this.ongoing && this.playerManager.alive) {
      nowPlayer = this.playerManager.nowPlayer;
      await this.run(nowPlayer);
    }

    if (this.ongoing) {
      switch (nowPlayer.status.now) {
        case "IDLE":
          return this.end("IDLE");
        case "LEAVING":
          return this.end("STOPPED");
        case "DELETED":
          return this.end("DELETED");
      }
    }
  }

  async conclude(): Promise<void> {
    if (this.ongoing) {
      throw new Error('The game has not ended.');
    }

    const content = this.getEndContent();
    const embeds = [this.getEndEmbed()];
    await this.mainMessage?.reply({ content, embeds }).catch(() => {
      this.source.channel?.send({ content, embeds });
    });
  }

  protected ephemeralFollowUp(options: InteractionReplyOptions): void {
    if ('followUp' in this.source) {
      options.ephemeral = true;
      this.source.followUp(options);
    }
  }


  private getEndEmbed(): MessageEmbed {
    if (this.duration == null) {
      throw new Error('The game has neither initiallized nor ended yet.')
    }
  
    const message = this.strings.endMessages;
    const min = ~~(this.duration/60000);
    const sec = fixedDigits(Math.round(this.duration/1000) % 60, 2);
  
    const embed = new MessageEmbed()
      .setAuthor({ name: format(message.gameStats.header, { game: this.strings.name }), iconURL: this.client.user?.displayAvatarURL() })
      .setColor(0x000000)
      .setDescription(format(message.gameStats.message, { min, sec, step: this.playerManager.totalSteps }));
  
    if (this.playerManager.playerCount > 1) {
      for (const player of this.playerManager.players) {
        const m = ~~(player.time/60000);
        const s = fixedDigits(Math.round(player.time/1000) % 60, 2);
        embed.addField(player.username, format(message.playerStats.message, { min: m, sec: s, step: player.steps }), true);
      }
    }
  
    return embed;
  }

  private async getInput(): Promise<string | null> {
    // Since awaitMessageComponent() may reject, a must-resolving Promise is needed
    const promises: (Promise<any> | void)[] = [sleep(this.time, null)];

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
    if (input.customId) {
      await input.update({});
      return input.customId;
    }

    const message = input.first();
    await message.delete(() => {});
    return message.content;
  }
}
