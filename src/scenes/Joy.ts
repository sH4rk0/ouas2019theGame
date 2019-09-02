export default class Joy extends Phaser.Scene {
  public stick: any;
  public jump: any;
  public up: any;
  public down: any;
  public left: any;
  public right: any;

  constructor() {
    super({
      key: "Joy"
    });
  }

  preload() {
    this.load.atlas(
      "cursors",
      "assets/images/game/cursors/cursors.png",
      "assets/images/game/cursors/cursors.json"
    );

    //this.load.atlas("dpad", "assets/skins/dpad.png", "assets/skins/dpad.json");

    this.load.scenePlugin(
      "VirtualJoystickPlugin",
      "assets/js/VirtualJoystickPlugin.min.js",
      "VirtualJoystickPlugin",
      "pad"
    );
  }

  create(): void {
    this.input.addPointer(2);

    //@ts-ignore

    // this.stick = this.pad.addHiddenStick(100);

    //this.stick = this.pad.HiddenStick(150, 620, 200, "dpad").setScale(0.75);

    //@ts-ignore
    //this.stick.setMotionLock();
    //this.stick.alignBottomLeft()

    //@ts-ignore
    this.up = this.pad.addButton(200, 630 - 50, "cursors", "up", "upDown");

    //@ts-ignore
    this.down = this.pad.addButton(
      200,
      730 - 50,
      "cursors",
      "down",
      "downDown"
    );
    //@ts-ignore
    this.left = this.pad.addButton(100, 630, "cursors", "left", "leftDown");
    //@ts-ignore
    this.right = this.pad.addButton(300, 630, "cursors", "right", "rightDown");
    //@ts-ignore
    this.jump = this.pad.addButton(1160, 630, "cursors", "jump", "jumpDown");

    //this.jump.alignBottomRight()

    //  Optional joystick Debug elements
    //this.debugGraphic = this.add.graphics();
    /*this.debugText = this.add
      .text(10, 10, "", { font: "16px Courier", fill: "#fff" })
      .setShadow(1, 1);*/
  }

  show(): void {}
  hide(): void {}
}
