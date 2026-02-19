export class EnemySkill {
  private _active: boolean = true;
  private currentTimeout!: number;
  private currentTurnsToCast!: number;
  private currentValue: number = 0;
  constructor(
    private readonly value: number,
    private readonly timeout: number,
    private readonly name: string,
    private readonly turnsToCast: number,
  ) {
    this.currentTimeout = 0;
    this.currentValue = value;
    this.currentTurnsToCast = turnsToCast;
  }
  public tryCast() {
    if (this.currentTurnsToCast > 0) {
      this.currentTurnsToCast--;
      return { status: false, value: this.currentValue };
    } else {
      this.currentTurnsToCast = this.turnsToCast;
      this.currentTimeout = this.timeout;
      this.currentValue = this.value;
      this._active = false;
      return { status: true, value: this.currentValue };
    }
  }

  get active() {
    return this._active;
  }
  public update() {
    if (this.currentTimeout > 0) this.currentTimeout--;
    if (this.currentTimeout === 0) this._active = true;
  }
  public setValue(newValue: number) {
    this.currentValue = newValue;
  }
  public getValue(): number {
    return this.currentValue;
  }
}
