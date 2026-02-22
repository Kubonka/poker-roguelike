export class EnemySkill {
  private _active = true;
  private casting = false;

  public currentTimeout: number;
  public currentTurnsToCast: number;
  public currentValue: number;

  constructor(
    private readonly value: number,
    private readonly timeout: number,
    private readonly name: string,
    private readonly turnsToCast: number,
  ) {
    this.currentTimeout = 0;
    this.currentTurnsToCast = turnsToCast;
    this.currentValue = value;
  }

  get active() {
    return this._active;
  }

  public tryCast() {
    if (!this._active) return { status: false, value: 0 };

    this.casting = true;

    if (this.currentTurnsToCast > 1) {
      this.currentTurnsToCast--;
      return { status: false, value: this.currentValue };
    }

    return { status: true, value: this.currentValue };
  }

  public enterCooldown() {
    this._active = false;
    this.casting = false;
    this.currentTimeout = this.timeout;
    this.currentTurnsToCast = this.turnsToCast;
    this.currentValue = this.value;
  }

  public updateCooldown() {
    if (this.currentTimeout > 0) {
      this.currentTimeout--;
    }

    if (this.currentTimeout === 0) {
      this._active = true;
    }
  }

  public setValue(v: number) {
    this.currentValue = v;
  }

  public getValue() {
    return this.currentValue;
  }
}
// export class EnemySkill {
//   public _active: boolean = true;
//   public currentTimeout!: number;
//   public currentTurnsToCast!: number;
//   public currentValue: number = 0;
//   constructor(
//     private readonly value: number,
//     private readonly timeout: number,
//     private readonly name: string,
//     private readonly turnsToCast: number,
//   ) {
//     this.resetState();
//   }
//   private resetState() {
//     this.currentTimeout = 0;
//     this.currentValue = this.value;
//     this.currentTurnsToCast = this.turnsToCast;
//     this._active = true;
//   }
//   public tryCast() {
//     if (this.currentTurnsToCast > 0) {
//       this.currentTurnsToCast--;
//       return { status: false, value: this.currentValue };
//     } else {
//       this.currentTurnsToCast = this.turnsToCast;
//       this.currentTimeout = this.timeout;
//       this.currentValue = this.value;
//       this._active = false;
//       return { status: true, value: this.currentValue };
//     }
//   }

//   get active() {
//     return this._active;
//   }
//   public update() {
//     if (this.currentTimeout > 0) this.currentTimeout--;
//     if (this.currentTimeout === 0) {
//       this.resetState();
//     }
//   }
//   public setValue(newValue: number) {
//     this.currentValue = newValue;
//   }
//   public getValue(): number {
//     return this.currentValue;
//   }
// }
