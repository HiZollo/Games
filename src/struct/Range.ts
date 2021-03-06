export class Range {
  public min: number;
  public max: number;

  
  constructor(min: number = -Infinity, max: number = Infinity) {
    this.min = min;
    this.max = max;
  }

  get interval(): number {
    return this.max - this.min
  }

  inOpenRange(value: number): boolean {
    return this.min < value && value < this.max;
  }
  
  inClosedRange(value: number): boolean {
    return this.min <= value && value <= this.max;
  }
}