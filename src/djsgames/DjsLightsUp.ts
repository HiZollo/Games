import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { DjsGameWrapper } from './DjsGameWrapper';
import { LightsUp } from '../games/LightsUp';
import { Player } from '../struct/Player';
import { DjsLightsUpOptions, LightsUpStrings, DjsInputResult } from '../types/interfaces';
import { format, overwrite } from '../util/Functions';
import { lightsUp } from '../util/strings.json';

export class DjsLightsUp extends DjsGameWrapper {
  public answered: boolean;

  public strings: LightsUpStrings;
  public mainMessage: Message | void;
  public controller: MessageActionRow;
  public controllerMessage: Message | void;

  protected game: LightsUp;
  protected inputMode: number;
  protected boardButtons: MessageButton[][];


  constructor({ players, boardSize = 5, source, time, strings }: DjsLightsUpOptions) {
    super({ source, time });
    if (boardSize > 5) {
      throw new Error('The size of the board should be at most 5.');
    }
    this.game = new LightsUp({ players, boardSize });

    this.strings = overwrite(JSON.parse(JSON.stringify(lightsUp)), strings);
    this.controller = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('HZG_CTRL_answer')
        .setLabel(this.strings.controller.answer)
        .setStyle("SUCCESS"), 
      new MessageButton()
        .setCustomId('HZG_CTRL_stop')
        .setLabel(this.strings.controller.stop)
        .setStyle("DANGER")
    );

    this.mainMessage = undefined;
    this.controllerMessage = undefined;

    this.inputMode = 0b10;
    this.answered = false;
    this.boardButtons = [];
  }

  async initialize(): Promise<void> {
    this.game.initialize();

    for (let i = 0; i < this.game.boardSize; i++) {
      this.boardButtons.push([]);
      for (let j = 0; j < this.game.boardSize; j++) {
        this.boardButtons[i].push(new MessageButton()
          .setCustomId(`HZG_PLAY_${i}_${j}`)
          .setLabel('\u200b')
          .setStyle(this.game.board[i][j] ? "PRIMARY" : "SECONDARY")
        );
      }
    }

    if ('editReply' in this.source) {
      if (!this.source.inCachedGuild()) { // type guard
        throw new Error('The guild is not cached.');
      }
      if (!this.source.deferred) {
        await this.source.deferReply();
      }
      this.mainMessage = await this.source.editReply({ content: '\u200b', components: this.displayBoard });
      this.controllerMessage = await this.source.followUp({ content: '\u200b', components: [this.controller] });
    }
    else {
      this.mainMessage = await this.source.channel.send({ content: '\u200b', components: this.displayBoard });
      this.controllerMessage = await this.mainMessage.reply({ content: '\u200b', components: [this.controller] });
    }
  }

  flip(row: number, col: number): void {
    this.game.flip(row, col);

    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
      const nr = row + dr, nc = col + dc;
      if (0 <= nr && nr < this.game.boardSize && 0 <= nc && nc < this.game.boardSize) {
        this.boardButtons[nr][nc].setStyle(this.game.board[nr][nc] ? "PRIMARY" : "SECONDARY");
      }
    });
  }

  getEndContent(): string {
    const message = this.strings.endMessages;
    switch (this.game.status.now) {
      case "JACKPOT":
        return format(message.jackpot, { player: `<@${this.game.winner?.id}>` });
      case "WIN":
        return format(this.answered ? message.win : message.unansweredWin, { player: `<@${this.game.winner?.id}>` });
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
    return i.user.id === this.game.playerManager.nowPlayer.id;
  }

  protected messageFilter = (): boolean => {
    return false;
  }

  protected idleToDo(nowPlayer: Player): DjsInputResult {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }

    nowPlayer.status.set("IDLE");
    return {
      components: this.displayBoard, 
    };
  }

  protected buttonToDo(nowPlayer: Player, input: string, interaction: ButtonInteraction): DjsInputResult {
    if (!this.mainMessage) {
      throw new Error('Something went wrong when sending reply.');
    }
    const args = input.split('_');

    if (args[0] !== "HZG") {
      throw new Error('Invalid button received.');
    }
    
    let endStatus = "";
    if (args[1] === "CTRL") {
      if (args[2] === 'stop') {
        nowPlayer.status.set("LEAVING");
      }
      if (args[2] === 'answer') {
        nowPlayer.status.set("PLAYING");
        interaction.followUp({ content: format(this.strings.currentAnswer, { answer: this.answerContent }), ephemeral: true });
      }
    }
    else if (args[1] === "PLAY") {
      nowPlayer.status.set("PLAYING");
      nowPlayer.addStep();

      this.flip(parseInt(args[2], 10), parseInt(args[3], 10));

      if (this.game.win()) {
        this.game.winner = nowPlayer;
        endStatus = "WIN";
      }
    }

    return {
      components: this.displayBoard, 
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

    this.game.playerManager.next();
    await this.mainMessage.edit(result).catch(() => {
      result.endStatus = "DELETED";
    });
    return result;
  }

  protected async end(status: string): Promise<void> {
    this.game.end(status);

    this.boardButtons.forEach(row => {
      row.forEach(button => {
        button.setDisabled(true);
      })
    });

    await this.mainMessage?.edit({ components: this.displayBoard }).catch(() => {});
    await this.controllerMessage?.delete().catch(() => {});
  }


  private get displayBoard(): MessageActionRow[] {
    const actionRows = [];
    for (let i = 0; i < this.game.boardSize; i++) {
      actionRows.push(new MessageActionRow());
      for (let j = 0; j < this.game.boardSize; j++) {
        actionRows[i].addComponents(this.boardButtons[i][j]);
      }
    }
    return actionRows;
  }

  private get answerContent(): string {
    this.answered = true;
    let content = '';
    for (let i = 0; i < this.game.boardSize; i++) {
      for (let j = 0; j < this.game.boardSize; j++)
        content += this.strings.answerSymbols[this.game.answer[i][j] ? 1 : 0];
      content += '\n';
    }
    return content;
  }
}