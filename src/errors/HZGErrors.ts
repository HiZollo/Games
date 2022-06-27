// The whole error system is inspired by discord.js module
import { ErrorCodes } from "./ErrorCodes";
import { Messages } from "./Messages";

export class HZGError extends Error {
  private _code: string;

  constructor(code: ErrorCodes, ...args: any[]) {
    super(message(code, args));
    this._code = ErrorCodes[code];
    Error.captureStackTrace?.(this, HZGError);
  }

  public override get name(): string {
    return `[${super.name}] ${this._code}`;
  }
}

export class HZGTypeError extends TypeError {
  private _code: string;

  constructor(code: ErrorCodes, ...args: any[]) {
    super(message(code, args));
    this._code = ErrorCodes[code];
    Error.captureStackTrace?.(this, HZGTypeError);
  }

  public override get name(): string {
    return `[${super.name}] ${this._code}`;
  }
}

export class HZGRangeError extends RangeError {
  private _code: string;

  constructor(code: ErrorCodes, ...args: any[]) {
    super(message(code, args));
    this._code = ErrorCodes[code];
    Error.captureStackTrace?.(this, HZGRangeError);
  }

  public override get name(): string {
    return `[${super.name}] ${this._code}`;
  }
}

function message(code: ErrorCodes, args: any[]): string {
  if (typeof code !== 'number') throw new Error('Error code must be a valid HZGames ErrorCodes');
  const msg = Messages[code];
  if (!msg) throw new Error(`An invalid error code was used: ${code}.`);
  if (typeof msg === 'function') return msg(...args);
  if (!args?.length) return msg;
  args.unshift(msg);
  return String(...args);
}