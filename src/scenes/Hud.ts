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
                 private _pauseTimer: Phaser.Events.EventEmitter;
                 private _playTimer: Phaser.Events.EventEmitter;
                 private _endWriter: Phaser.Events.EventEmitter;
                 private _showJumpTip: Phaser.Events.EventEmitter;
                 private _showKeysTip: Phaser.Events.EventEmitter;
                 private _showSearchTip: Phaser.Events.EventEmitter;

                 private helpText: Phaser.GameObjects.Text;

                 private timerText: Phaser.GameObjects.BitmapText;
                 private timerImage: Phaser.GameObjects.Image;

                 private textwriter: Phaser.GameObjects.Text;

                 private letters: Array<string> = [
                   "A",
                   "B",
                   "C",
                   "D",
                   "E",
                   "F",
                   "G",
                   "H",
                   "I",
                   "J",
                   "K",
                   "L",
                   "M",
                   "N",
                   "O",
                   "P",
                   "Q",
                   "R",
                   "S",
                   "T",
                   "U",
                   "V",
                   "W",
                   "X",
                   "Y",
                   "Z",
                   "0",
                   "1",
                   "2",
                   "3",
                   "4",
                   "5",
                   "6",
                   "7",
                   "8",
                   "9"
                 ];
                 private textIsAnim: boolean = false;
                 private textActive: boolean = true;
                 private texts = [
                   //"        MISSION COMPLETED!#         "
                   { text: "  You have completed the mission..# " },
                   { text: " ...not impossible as the original!#" },
                   { text: "                 #                  " },
                   { text: "          Code: Mr.Killer#          " },
                   { text: "   GFX: www.spriters-resource.com#  " },
                   { text: "      OUAS LOGO: Marco Giammetti#    " },
                   { text: "         SFX: freesound.org#        " },
                   { text: "         Music: GnG level5#         " },
                   { text: "                  #                 " },
                   { text: "           Greetings A-Z to:#       " },
                   { text: "        Roberto De Gregorio#        " },
                   { text: "           Andrea Ferlito#          " },
                   { text: "           HOKUTO FORCE#            " },
                   { text: "               Maxag#               " },
                   { text: "          Randall Flagg#            " },
                   { text: "         Raffaele Valensise#        " },
                   { text: "              xOANINO#              " },
                   { text: "       and all OUAS supporters!#    " },
                   { text: "                  #                 " },
                   { text: "      See you next year at...#      " },
                   { text: "      ONCE UPON A SPRITE 2020#      " },
                   { text: "                  #                 " },
                   { text: "              THE END               " }
                 ];
                 private currentTextIndex: number = 0;

                 private textArr: Array<string> = [];

                 constructor() {
                   super({
                     key: "Hud"
                   });
                 }

                 create(): void {
                   const _config = {
                     font: "35px",
                     fill: "#ffffff",
                     stroke: "#000000",
                     strokeThickness: 4,
                     wordWrap: true,
                     wordWrapWidth: 1000
                   };

                   this.textwriter = this.add
                     .text(0, 300, "", _config)
                     .setStroke("#000000", 10)
                     .setAlpha(1)
                     .setOrigin(0)
                     .setFontFamily('"Press Start 2P"')
                     .setDepth(1001)
                     .setScrollFactor(0);

                   this.helpText = this.add
                     .text(
                       this.game.canvas.width / 2,
                       this.game.canvas.height / 2,
                       "",
                       _config
                     )
                     .setStroke("#000000", 10)
                     .setAlpha(0)
                     .setOrigin(0.5)
                     .setFontFamily('"Press Start 2P"')
                     .setDepth(1002)
                     .setScrollFactor(0);

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
                   level.events.off("startEndWriter", this.hide, this);
                   level.events.off("pauseTimer", this.timerPause, this);
                   level.events.off("playTimer", this.timerPlay, this);

                   level.events.off("showJumpTip", this.showJumpTip, this);
                   level.events.off("showKeysTip", this.showKeysTip, this);
                   level.events.off("showSearchTip", this.showSearchTip, this);

                   this._endWriter = level.events.on(
                     "startEndWriter",
                     this.startEnd,
                     this
                   );
                   this._pauseTimer = level.events.on(
                     "pauseTimer",
                     this.timerPause,
                     this
                   );
                   this._playTimer = level.events.on(
                     "playTimer",
                     this.timerPlay,
                     this
                   );
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
                   this._startTimer = level.events.on(
                     "startTimer",
                     this.startTimer,
                     this
                   );
                   this._showHUD = level.events.on("showHUD", this.show, this);
                   this._hideHUD = level.events.on("hideHUD", this.hide, this);

                   this._showJumpTip = level.events.on(
                     "showJumpTip",
                     this.showJumpTip,
                     this
                   );
                   this._showKeysTip = level.events.on(
                     "showKeysTip",
                     this.showKeysTip,
                     this
                   );
                   this._showSearchTip = level.events.on(
                     "showSearchTip",
                     this.showSearchTip,
                     this
                   );
                 }

                 showJumpTip(): void {
                   this.showTip("SPACE: jump");
                 }
                 showKeysTip(): void {
                   this.showTip("WASD or ARROWS: move");
                 }
                 showSearchTip(): void {
                   this.showTip("W or UP: search");
                 }

                 showTip(tip: string) {
                   this.helpText.setText(tip);
                   this.tweens.add({
                     targets: this.helpText,
                     alpha: 1,
                     yoyo: true,
                     repeat: 0,
                     hold: 2000,
                     duration: 300,
                     onComplete: () => {}
                   });
                 }

                 update() {
                   if (this.textIsAnim) {
                     this.textwriter.setText(this.textArr.join(""));
                   }
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

                   this.livesGroup
                     .getChildren()
                     .forEach((element: any, index: number) => {
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

                 private timerPause() {
                   this.pauseTimer = true;
                 }
                 private timerPlay() {
                   this.pauseTimer = false;
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

                 private startEnd(): void {
                   console.log("gameCompleted emitted");
                   this.textWriter(0);
                 }

                 private restartTimer(): void {
                   //console.log('restartTimer')
                   if (this.timer != null) this.timer.destroy();
                   this.pauseTimer = false;
                   //@ts-ignore
                   this.setTimerText();
                   this.startTimer();
                 }

                 private stopTimer(): void {
                   //console.log('restartTimer')
                   if (this.timer != null) this.timer.destroy();
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
                   for (
                     let lives = 0;
                     lives < this.registry.get("lives");
                     lives++
                   ) {
                     this.livesGroup.add(
                       this.add
                         .image(1140 + 70 - 80 * lives, 60, "heart")
                         .setScale(2)
                         .setAlpha(0)
                     );
                   }
                 }

                 private updateLives(): void {
                   this.livesGroup.remove(
                     this.livesGroup.getFirstAlive(),
                     true
                   );
                 }

                 textWriter(index: number) {
                   if (!this.textActive) return;

                   let obj: any = this.texts[index];
                   this.currentTextIndex = index;
                   this.textIsAnim = true;

                   if (obj == null) {
                     this.textIsAnim = false;
                     this.textWriter(0);
                     return;
                   }

                   this.add.tween({
                     targets: this.textwriter,
                     alpha: 1,
                     duration: 500,
                     delay: 0
                   });

                   //this.textwriter.x = obj.x;
                   this.textwriter.text = "";
                   // this.textwriter.setFontSize(obj.size);
                   this.textArr = [];

                   for (var i = 0; i < obj.text.length; i++) {
                     if (obj.text[i] != " ") {
                       this.tweenTextArr(obj.text[i], i, 1000 + i * 50);
                     } else {
                       this.textArr[i] = " ";
                     }
                   }
                 }

                 tweenTextArr(letter: string, index: number, delay: number) {
                   this.textArr[index] = "";

                   this.tweens.addCounter({
                     from: 0,
                     to: 100,
                     duration: 500,
                     ease: "Sine.Out",
                     onUpdate: () => {
                       if (letter != "#") {
                         this.textArr[index] = Phaser.Utils.Array.GetRandom(
                           this.letters
                         );
                       }
                     },
                     onComplete: () => {
                       if (letter != "#") this.textArr[index] = letter;

                       //console.log(letter);
                       if (letter == "#") {
                         this.textArr[index] = "";
                         this.add.tween({
                           targets: this.textwriter,
                           alpha: 0,
                           duration: 500,
                           delay: 500,
                           onComplete: () => {
                             this.textWriter(this.currentTextIndex + 1);
                           }
                         });
                       }
                     },
                     delay: delay
                   });
                 }
               }
