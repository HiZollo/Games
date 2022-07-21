import { EventEmitter } from 'events';
import { ButtonInteraction, Client, Collection, CommandInteraction, ComponentType, EmbedBuilder, InteractionCollector, Message } from 'discord.js';
import { HZGError, ErrorCodes } from '../errors';
import { Game, Player } from '../struct';
import { DjsGameInitializeMessageOptions, DjsGameWrapperOptions, DjsInputResult, GameStrings } from '../types';
import { fixedDigits, format, sleep } from '../util/Functions';

export abstract class DjsGameWrapper {
  public client: Client;
  public source: CommandInteraction | Message;
  public time: number;
  public mainMessage: Message | void;
  public subMessage: Message | void;
  public loser: Player | null;
  public winner: Player | null;

  protected controllerCollector: InteractionCollector<ButtonInteraction> | void;
  protected conveyor: EventEmitter;

  public abstract strings: GameStrings;
  public abstract getEndContent(): string;
  
  protected abstract game: Game;
  protected abstract inputMode: number;
  protected abstract buttonFilter(i: ButtonInteraction): boolean;
  protected abstract messageFilter(m: Message): boolean;
  protected abstract idleToDo(nowPlayer: Player): DjsInputResult;
  protected abstract playToDo(nowPlayer: Player, input: any): DjsInputResult;
  protected abstract botMove(bot: Player): Promise<DjsInputResult>;
  protected abstract update(result: DjsInputResult): Promise<DjsInputResult>;
  protected abstract end(status: string): Promise<void>;


  constructor({ source, time = 60e3 }: DjsGameWrapperOptions) {
    if (!source.channel) {
      throw new HZGError(ErrorCodes.InvalidChannel);
    }

    this.client = source.client;
    this.source = source;
    this.time = time;

    this.mainMessage = undefined;
    this.subMessage = undefined;
    this.loser = null;
    this.winner = null;
    this.controllerCollector = undefined;
    this.conveyor = new EventEmitter();

    this.ctrlCollected = this.ctrlCollected.bind(this);
  }

  public async initialize(main: DjsGameInitializeMessageOptions, sub?: DjsGameInitializeMessageOptions): Promise<void> {
    this.game.initialize();

    if ('editReply' in this.source) {
      if (!this.source.inCachedGuild()) { // type guard
        throw new HZGError(ErrorCodes.GuildNotCached);
      }
      if (!this.source.deferred) {
        await this.source.deferReply();
      }

      this.mainMessage = await this.source.editReply({ content: main.content, components: main.components });
      this.subMessage = sub ? (await this.source.followUp({ content: sub.content, components: sub.components })) : this.mainMessage;
    }
    else {
      this.mainMessage = await this.source.channel.send({ content: main.content, components: main.components });
      this.subMessage = sub ? (await this.mainMessage.reply({ content: sub.content, components: sub.components })) : this.mainMessage;
    }

    this.controllerCollector = this.subMessage.createMessageComponentCollector({
      componentType: ComponentType.Button, 
      filter: (i: ButtonInteraction): boolean => {
        return i.customId.startsWith("HZG_CTRL") && this.game.playerManager.ids.includes(i.user.id);
      }
    });
  }

  // main logic
  protected async run(nowPlayer: Player): Promise<void> {
    let result: DjsInputResult;
    if (nowPlayer.bot) {
      result = await this.botMove(nowPlayer);
    }
    else {
      const input = await this.getInput();

      if (nowPlayer.status.now === "LEFT") {
        result = { content: format(this.strings.playerLeft, { player: nowPlayer.username }) };
      }
      else if (input === null) {
        result = this.idleToDo(nowPlayer);
      }
      else {
        result = this.playToDo(nowPlayer, input);
      }
    }

    result = await this.update(result);
    if (result.endStatus) {
      await this.end(result.endStatus);
    }
  }

  async start(): Promise<void> {
    if (this.mainMessage === undefined || this.subMessage === undefined || this.controllerCollector === undefined) {
      throw new HZGError(ErrorCodes.GameNotInitialized);
    }

    this.controllerCollector.on('collect', this.ctrlCollected);

    let nowPlayer: Player = this.game.playerManager.nowPlayer;
    while (this.game.ongoing && this.game.playerManager.alive) {
      nowPlayer = this.game.playerManager.nowPlayer;
      await this.run(nowPlayer);
    }

    this.controllerCollector.off('collect', this.ctrlCollected);

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
    if (this.mainMessage === undefined || this.subMessage === undefined || this.controllerCollector === undefined) {
      throw new HZGError(ErrorCodes.GameNotInitialized);
    }
    if (this.game.ongoing) {
      throw new HZGError(ErrorCodes.GameNotEnded);
    }

    const content = this.getEndContent();
    const embeds = [this.getEndEmbed()];
    await this.mainMessage.reply({ content, embeds }).catch(() => {
      this.source.channel?.send({ content, embeds });
    });
  }

  getEndEmbed(): EmbedBuilder {
    if (this.game.duration == null) {
      throw new HZGError(ErrorCodes.GameNotEnded);
    }
  
    const message = this.strings.endMessages;
    const min = ~~(this.game.duration/60000);
    const sec = fixedDigits(Math.round(this.game.duration/1000) % 60, 2);
  
    const embed = new EmbedBuilder()
      .setAuthor({ name: format(message.gameStats.header, { game: this.strings.name }), iconURL: this.client.user?.displayAvatarURL() })
      .setColor(0x000000)
      .setDescription(format(message.gameStats.message, { min, sec, step: this.game.playerManager.totalSteps }));
  
    if (this.game.playerManager.playerCount > 1) {
      for (const player of this.game.playerManager.players) {
        const m = ~~(player.time/60000);
        const s = fixedDigits(Math.round(player.time/1000) % 60, 2);
        embed.addFields({
          name: player.username, 
          value: format(message.playerStats.message, { min: m, sec: s, step: player.steps }), 
          inline: true
        });
      }
    }
  
    return embed;
  }


  protected async ctrlCollected(interaction: ButtonInteraction): Promise<void> {
    if (interaction.customId === 'HZG_CTRL_leave') {
      const index = this.game.playerManager.getIndex(interaction.user.id);
      if (index < 0) return;

      const message = await interaction.deferReply({ fetchReply: true });
      this.game.playerManager.kick(interaction.user.id);
      if (interaction.user.id === this.game.playerManager.nowPlayer.id) {
        this.conveyor.emit('playerLeft');
      }

      await interaction.editReply({ content: format(this.strings.playerLeft, { player: this.game.playerManager.players[index].username }) });
      if ('delete' in message) {
        setTimeout(() => {
          message.delete().catch(() => {});
        }, 3e3);
      }
    }
  }
  

  protected async getInput(): Promise<any> {
    if (this.mainMessage === undefined || this.subMessage === undefined) {
      throw new HZGError(ErrorCodes.GameNotInitialized);
    }

    // Since awaitMessageComponent() may reject, a must-resolving Promise is needed
    const promises: Promise<ButtonInteraction | Collection<string, Message> | null>[] = [sleep(this.time, null)];

    promises.push(new Promise(resolve => {
      this.conveyor.on('playerLeft', () => {
        resolve(null);
      });
    }));

    // button input from sub message
    promises.push(this.subMessage.awaitMessageComponent({
      filter: this.buttonFilter,
      componentType: ComponentType.Button,
      time: this.time
    }));
  
    // button input from main message
    if (this.inputMode & 0b10)
      promises.push(this.mainMessage.awaitMessageComponent({
        filter: this.buttonFilter,
        componentType: ComponentType.Button,
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
    this.conveyor.removeAllListeners('playerLeft');

    if (input == null) {
      return null;
    }
    if ('customId' in input) {
      await input.deferUpdate();
      return input.customId;
    }

    const message = input.first();
    if (!message) {
      return null;
    }
    await message.delete().catch(() => {});
    return message.content;
  }
}
