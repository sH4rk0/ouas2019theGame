export default class HUD extends Phaser.Scene {
  //@ts-ignore
  //private textElements: Map<string, Phaser.GameObjects.BitmapText>;
  private timer: Phaser.Time.TimerEvent;
  private livesGroup: Phaser.GameObjects.Group;
  private hurryupText: Phaser.GameObjects.BitmapText;
  private pauseTimer: boolean = false;
  private _showHUD: Phaser.Events.EventEmitter;
  private _hideHUD: Phaser.Events.EventEmitter;
  private _livesChanged: Phaser.Events.EventEmitter;
  private _restartTimer: Phaser.Events.EventEmitter;
  private _startTimer: Phaser.Events.EventEmitter;

  private timerText: Phaser.GameObjects.BitmapText;
  private timerImage: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: "Hud"
    });
  }

  create(): void {
    this.hurryupText = this.add
      .bitmapText(0, 360, "commodore", "HURRY UP!!!!", 60)
      .setAlpha(0)
      .setOrigin(0.5);

    this.livesGroup = this.add.group();
    this.setUpLives();
    this.pauseTimer = false;

    this.timerImage = this.add
      .image(50, 60, "time")
      .setScale(2)
      .setAlpha(0);

    this.timerText = this.addText(
      100,
      45,
      `${this.registry.get("time")}`
    ).setAlpha(0);

    // create events

    const level = this.scene.get("GamePlay");

    level.events.off("livesChanged", this.updateLives, this);
    level.events.off("restartTimer", this.restartTimer, this);
    level.events.off("startTimer", this.startTimer, this);
    level.events.off("showHUD", this.show, this);
    level.events.off("hideHUD", this.hide, this);

    this._livesChanged = level.events.on(
      "livesChanged",
      this.updateLives,
      this
    );

    this._restartTimer = level.events.on(
      "restartTimer",
      this.restartTimer,
      this
    );

    this._startTimer = level.events.on("startTimer", this.startTimer, this);

    this._showHUD = level.events.on("showHUD", this.show, this);
    this._hideHUD = level.events.on("hideHUD", this.hide, this);
  }

  private show() {
    this.registry.values.time = 100;
    this.setTimerText();
    this.setUpLives();
    this.tweens.add({
      targets: [this.timerImage, this.timerText],
      alpha: 1,
      duration: 500
    });

    this.livesGroup.getChildren().forEach((element: any, index: number) => {
      this.tweens.add({
        targets: element,
        alpha: 1,
        duration: 500,
        delay: index * 300
      });
    });
  }

  private hide() {
    this.stopTimer();
    this.tweens.add({
      targets: [this.timerImage, this.timerText],
      alpha: 0,
      duration: 500
    });
    this.livesGroup.clear(true, true);
  }

  private startTimer(): void {
    this.pauseTimer = false;
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTime,
      callbackScope: this,
      loop: true
    });
  }

  private addText(
    x: number,
    y: number,
    value: string
  ): Phaser.GameObjects.BitmapText {
    return this.add.bitmapText(x, y, "commodore", value, 30);
  }

  private updateTime(): void {
    if (!this.pauseTimer) {
      //console.log('updateTime')
      this.registry.values.time -= 1;
      if (this.registry.values.time == 10) {
        this.hurryup();
      }

      if (this.registry.values.time == 0) {
        this.pauseTimer = true;
        this.events.emit("timeEnded");
        this.timer.destroy();
      }
      //@ts-ignore
      this.setTimerText();
    }
  }

  private hurryup() {
    this.events.emit("hurryUp");

    this.tweens.add({
      targets: this.hurryupText,
      alpha: 1,
      x: 640,
      ease: "Power1",
      duration: 1000,
      completeDelay: 1000,
      onComplete: () => {
        this.tweens.add({
          targets: this.hurryupText,
          alpha: 0,
          x: 1280,
          ease: "Power1",
          duration: 1000,

          onComplete: () => {
            this.hurryupText.setX(0);
          }
        });
      }
    });
  }

  private restartTimer(): void {
    //console.log('restartTimer')
    this.timer.destroy();
    this.pauseTimer = false;
    //@ts-ignore
    this.setTimerText();
    this.startTimer();
  }

  private stopTimer(): void {
    //console.log('restartTimer')
    this.timer.destroy();
    this.pauseTimer = false;
    //@ts-ignore
    this.setTimerText();
  }

  private setTimerText() {
    this.timerText.setText(`${this.registry.get("time")}`);
  }

  private setUpLives() {
    this.pauseTimer = true;
    this.livesGroup.clear(true, true);
    for (let lives = 0; lives < this.registry.get("lives"); lives++) {
      this.livesGroup.add(
        this.add
          .image(1140 + 70 - 80 * lives, 60, "heart")
          .setScale(2)
          .setAlpha(0)
      );
    }
  }

  private updateLives(): void {
    this.livesGroup.remove(this.livesGroup.getFirstAlive(), true);
  }
}
