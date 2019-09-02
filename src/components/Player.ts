/**
 * @author       Francesco Raimondo <francesco.raimondo@gmail.com>
 * @copyright    2019 zero89
 * @description  Run4Mayor
 * @license      zero89
 */
import GamePlay from "../scenes/GamePlay";
import Joy from "../scenes/Joy";
import { Platform } from "./obstacles/Platform";
import { Lift } from "./obstacles/Lift";
import { Item } from "./bonus/Item";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private currentScene: GamePlay;
  private acceleration: number = 500;
  private isJumping: boolean = false;
  private isDown: boolean = false;
  private stillDown: boolean = false;

  private isDying: boolean = false;
  private key: string;
  private commands: boolean;
  private inGame: boolean;
  private JoyScene: Joy;
  private touchingPlatform: boolean;
  private touchedPlatform: Platform | Lift | null;
  private platformVelocity: number;
  private isSearching: boolean = false;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private playerAnimations: any = [
    {
      name: "idle",
      frames: [0, 1, 2, 3],
      framerate: 6,
      yoyo: false,
      repeat: -1
    },
    {
      name: "run",
      frames: [10, 11, 12, 13, 14, 15, 16, 17],
      framerate: 10,
      yoyo: false,
      repeat: -1
    },
    {
      name: "jump",
      frames: [21, 22, 23, 24, 25, 26, 27, 28, 26, 27, 28, 26, 27, 28],
      framerate: 10,
      yoyo: false,
      repeat: -1
    },

    {
      name: "down",
      frames: [20, 33, 34],
      framerate: 80,
      yoyo: false,
      repeat: 0
    },
    {
      name: "search",
      frames: [30, 31, 32],
      framerate: 6,
      yoyo: true,
      repeat: -1
    }
  ];

  constructor(config: PlayerConfig) {
    super(config.scene, config.x, config.y, config.key);
    this.inGame = config.inGame;
    if (config.physic) {
      config.scene.physics.world.enable(this);
      this.platformVelocity = 0;
      this.setMaxVelocity(300, 800);
      this.body.setSize(20, 48);
      this.body.setOffset(15, 20);
      this.setBounce(0);
      this.setDepth(9);
    }

    if (config.scene.sys.game.device.input.touch) {
      this.JoyScene = <Joy>config.scene.scene.get("Joy");
    }

    this.commands = config.commands;
    if (!this.commands) this.setImmovable();
    this.currentScene = <GamePlay>config.scene;
    this.key = config.key;
    this.name = config.name;

    let _animationConfig: Phaser.Types.Animations.Animation;
    this.playerAnimations.forEach((element: any) => {
      _animationConfig = {
        key: this.key + "-" + element.name,

        frames: this.currentScene.anims.generateFrameNumbers(this.key, {
          frames: element.frames
        }),
        frameRate: element.framerate,
        yoyo: element.yoyo,
        repeat: element.repeat
      };

      this.currentScene.anims.create(_animationConfig);
    });

    this.setOrigin(0.5, 0.5);
    this.setFlipX(false);

    this.cursors = this.currentScene.input.keyboard.createCursorKeys();

    if (this.cursors.left != null && this.cursors.left.isDown) {
    }

    this.setInteractive();

    if (!this.inGame) this.setTint(0x333333);

    this.currentScene.add.existing(this);
  }

  update(time: number, delta: number) {
    if (!this.isDying && this.commands && this.body != undefined) {
      this.handleInput(time, delta);
      /*if (this.currentScene.sys.game.device.input.touch) {
        //this.handleTouchInput(time, delta);
      } else {
        this.handleInput(time, delta);
      }*/
      this.handleAnimations();
    }
  }

  private handleInput(time: number, delta: number) {
    //if (!this.commands || this.isDying || this.body == undefined) return;

    if (this.isBodyOnFloor() || this.body.blocked.down) {
      this.isJumping = false;
      this.setAccelerationX(0);
      this.setVelocityY(0);
    }

    if (this.spaceIsDown() && !this.isJumping) {
      this.jump();
    }

    //run right
    ///////////////////////////////////
    if (this.rightIsDown()) {
      this.body.setSize(20, 48);
      this.body.setOffset(25, 20);
      this.setAccelerationX(this.acceleration);
      this.setFlipX(false);
    }

    //run left
    ///////////////////////////////////
    else if (this.leftIsDown()) {
      this.body.setSize(20, 48);
      this.body.setOffset(15, 20);
      this.setAccelerationX(-this.acceleration);
      this.setFlipX(true);
    }

    //set Down
    ///////////////////////////////////
    else if (
      this.downIsDown() &&
      !this.isDown &&
      !this.isJumping &&
      this.touchedPlatform == null
    ) {
      this.body.setSize(20, 30);
      if (this.flipX) {
        this.body.setOffset(15, 38);
      } else {
        this.body.setOffset(25, 38);
      }
      this.setVelocityX(0);
      this.setAccelerationX(0);
      this.isDown = true;
    }

    //set idle
    ///////////////////////////////////
    else if (
      (this.noCursorDown() &&
        (this.isBodyOnFloor ||
          this.touchingPlatform ||
          this.body.blocked.down) &&
        !this.isJumping &&
        !this.isSearching) ||
      (!this.leftIsDown() &&
        !this.rightIsDown() &&
        (this.isBodyOnFloor ||
          this.touchingPlatform ||
          this.body.blocked.down) &&
        !this.isJumping &&
        !this.isSearching &&
        !this.isDown) ||
      this.moreCursorDown()
    ) {
      this.body.setSize(20, 48);

      if (this.flipX) {
        this.body.setOffset(15, 20);
      } else {
        this.body.setOffset(25, 20);
      }

      this.setVelocityX(0);
      this.setAccelerationX(0);
      this.isDown = false;
      this.stillDown = false;
      this.isSearching = false;
    }

    //cursor down on a lift platform
    ///////////////////////////////////
    if (
      this.downIsDown() &&
      !this.isJumping &&
      this.touchedPlatform != null &&
      this.touchedPlatform.isTriggered() &&
      !this.touchedPlatform.isMoving()
    ) {
      this.isDown = true;
      this.touchedPlatform.trigger(2);
    }

    //cursor up on a lift platform
    ///////////////////////////////////
    if (
      this.upIsDown() &&
      !this.isJumping &&
      this.touchedPlatform != null &&
      this.touchedPlatform.isTriggered() &&
      !this.touchedPlatform.isMoving()
    ) {
      this.isDown = true;
      this.touchedPlatform.trigger(0);
    }
  }

  private handleAnimations(): void {
    if (!this.commands || this.isDying || this.body == undefined) return;

    if (
      this.body.velocity.y !== 0 &&
      !this.body.blocked.down &&
      !this.touchingPlatform
    ) {
      this.anims.play(this.key + "-jump", true);
    } else if (this.body.velocity.x !== 0 && !this.isJumping) {
      this.anims.play(this.key + "-run", true);
    } else if (
      this.body.velocity.x === 0 &&
      !this.isJumping &&
      this.touchedPlatform == null &&
      this.isDown &&
      !this.stillDown
    ) {
      this.stillDown = true;
      this.anims.play(this.key + "-down", true);
    } else if (this.isSearch()) {
      this.anims.play(this.key + "-search", true);
    } else if (
      (this.noCursorDown() &&
        (this.isBodyOnFloor() ||
          this.touchingPlatform ||
          this.body.blocked.down) &&
        !this.isDown &&
        !this.isJumping &&
        !this.isSearching) ||
      this.moreCursorDown()
    ) {
      this.anims.play(this.key + "-idle", true);
    }
  }

  setPlayerImmovable(): void {
    this.commands = false;
    this.setVelocity(0);
    this.setAcceleration(0);
    this.play("player-idle");
  }

  setMovable(): void {
    this.commands = true;
    this.setImmovable(false);
  }

  setCommands(command: boolean): void {
    this.commands = command;
  }

  jumpOverEnemy() {
    this.setVelocityY(-600);
  }

  isActive(): boolean {
    return this.commands;
  }

  die(): void {
    this.isDying = true;
    let _die: Phaser.GameObjects.Sprite = this.currentScene.add
      .sprite(this.x, this.y, this.key, 10)
      .setScale(2)
      .setDepth(2001);

    var tween = this.currentScene.tweens.add({
      targets: _die,
      y: this.y - 200,
      scaleY: 3,
      scaleX: 3,
      ease: "Sine.easeOut",
      duration: 300,
      repeat: 0
    });
    var tween2 = this.currentScene.tweens.add({
      targets: _die,
      y: this.y + 600,
      scaleY: 3.5,
      scaleX: 3.5,
      ease: "Sine.easeIn",
      delay: 300,
      duration: 500,
      onStart: () => {
        _die.setAngle(180);
      },
      onComplete: () => {
        _die.destroy();
      },
      repeat: 0
    });

    this.destroy(true);
  }

  gameOver(): void {
    this.destroy(true);
  }

  isTouchingPlatform(_platform: Platform | Lift): void {
    this.touchingPlatform = true;
    this.isJumping = false;
    this.touchedPlatform = _platform;
  }

  notTouchingPlatform() {
    this.touchingPlatform = false;
    this.touchedPlatform = null;
    this.platformVelocity = 0;
  }

  isDied(): boolean {
    return this.isDying;
  }

  isJump(): boolean {
    return this.isJumping;
  }

  isSearch(): boolean {
    return this.isSearching;
  }

  setSearch(search: boolean): void {
    this.isSearching = search;
  }

  private jump() {
    if (!this.isJumping) {
      this.currentScene.sound.playAudioSprite("sfx", "smb_jump-small", {
        volume: 0.3
      });
    }

    if (
      this.body.velocity.y <= 0 ||
      (this.body.touching.down && this.touchingPlatform) ||
      this.body.blocked.down ||
      !this.isJumping
    ) {
      this.touchingPlatform = false;
      this.touchedPlatform = null;

      this.setVelocityY(-600 + this.platformVelocity * -1);
    }
    this.isJumping = true;
  }

  addVelocity(velocity: number): void {
    this.platformVelocity = velocity;
  }

  spaceIsDown(): boolean {
    if (this.JoyScene == undefined) {
      if (this.cursors.space != null && this.cursors.space.isDown) return true;
      return false;
    } else if (this.JoyScene.jump && this.JoyScene.jump.isDown) {
      return true;
    } else {
      return false;
    }
  }

  isBodyOnFloor(): boolean {
    //@ts-ignore
    return this.body.onFloor();
  }

  downIsDown(): boolean {
    if (this.JoyScene == undefined) {
      if (
        this.cursors.down != null &&
        this.cursors.down.isDown &&
        (this.cursors.up != null && !this.cursors.up.isDown) &&
        (this.cursors.left != null && !this.cursors.left.isDown) &&
        (this.cursors.right != null && !this.cursors.right.isDown)
      )
        return true;
      return false;
    } else if (
      //this.JoyScene.stick &&
      //this.JoyScene.stick.direction === Phaser.DOWN
      this.JoyScene.down &&
      this.JoyScene.down.isDown
    ) {
      return true;
    } else {
      return false;
    }
  }
  upIsDown(): boolean {
    if (this.JoyScene == undefined) {
      if (
        this.cursors.up != null &&
        this.cursors.up.isDown &&
        (this.cursors.down != null && !this.cursors.down.isDown) &&
        (this.cursors.left != null && !this.cursors.left.isDown) &&
        (this.cursors.right != null && !this.cursors.right.isDown)
      )
        return true;
      return false;
    } else if (
      //this.JoyScene.stick &&
      //this.JoyScene.stick.direction === Phaser.UP
      this.JoyScene.up &&
      this.JoyScene.up.isDown
    ) {
      return true;
    } else {
      return false;
    }
  }

  leftIsDown(): boolean {
    if (this.JoyScene == undefined) {
      if (
        this.cursors.left != null &&
        this.cursors.left.isDown &&
        (this.cursors.up != null && !this.cursors.up.isDown) &&
        (this.cursors.down != null && !this.cursors.down.isDown) &&
        (this.cursors.right != null && !this.cursors.right.isDown)
      )
        return true;
      return false;
    } else if (
      //this.JoyScene.stick &&
      //this.JoyScene.stick.direction === Phaser.LEFT
      this.JoyScene.left &&
      this.JoyScene.left.isDown
    ) {
      return true;
    } else {
      return false;
    }
  }

  rightIsDown(): boolean {
    if (this.JoyScene == undefined) {
      if (
        this.cursors.right != null &&
        this.cursors.right.isDown &&
        (this.cursors.up != null && !this.cursors.up.isDown) &&
        (this.cursors.down != null && !this.cursors.down.isDown) &&
        (this.cursors.left != null && !this.cursors.left.isDown)
      )
        return true;
      return false;
    } else if (
      //this.JoyScene.stick &&
      //this.JoyScene.stick.direction === Phaser.RIGHT
      this.JoyScene.right &&
      this.JoyScene.right.isDown
    ) {
      return true;
    } else {
      return false;
    }
  }

  moreCursorDown(): boolean {
    if (
      (this.cursors.left != null &&
        this.cursors.left.isDown &&
        ((this.cursors.up != null && this.cursors.up.isDown) ||
          (this.cursors.down != null && this.cursors.down.isDown) ||
          (this.cursors.right != null && this.cursors.right.isDown))) ||
      (this.cursors.right != null &&
        this.cursors.right.isDown &&
        ((this.cursors.up != null && this.cursors.up.isDown) ||
          (this.cursors.down != null && this.cursors.down.isDown) ||
          (this.cursors.left != null && this.cursors.left.isDown))) ||
      (this.cursors.up != null &&
        this.cursors.up.isDown &&
        ((this.cursors.right != null && this.cursors.right.isDown) ||
          (this.cursors.down != null && this.cursors.down.isDown) ||
          (this.cursors.left != null && this.cursors.left.isDown))) ||
      (this.cursors.down != null &&
        this.cursors.down.isDown &&
        ((this.cursors.right != null && this.cursors.right.isDown) ||
          (this.cursors.up != null && this.cursors.up.isDown) ||
          (this.cursors.left != null && this.cursors.left.isDown)))
    )
      return true;
    return false;
  }

  noCursorDown(): boolean {
    if (
      this.cursors.left != null &&
      !this.cursors.left.isDown &&
      (this.cursors.up != null && !this.cursors.up.isDown) &&
      (this.cursors.down != null && !this.cursors.down.isDown) &&
      (this.cursors.right != null && !this.cursors.right.isDown)
    )
      return true;
    return false;
  }
}
