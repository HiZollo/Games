export class Range {
  public min: number;
  public max: number;

  
  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  inOpenRange(value: number): boolean {
    return this.min < value && value < this.max;
  }
  
  inClosedRange(value: number): boolean {
    return this.min <= value && value <= this.max;
  }
}