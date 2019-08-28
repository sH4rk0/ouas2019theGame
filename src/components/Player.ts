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

export class Player extends Phaser.Physics.Arcade.Sprite {
  private currentScene: GamePlay;
  private acceleration: number = 500;
  private isJumping: boolean = false;
  private isDown: boolean = false;
  private isDying: boolean = false;
  private key: string;
  private commands: boolean;
  private inGame: boolean;
  private jumpTimer: number;
  private JoyScene: Joy;
  private touchingPlatform: boolean;
  private touchedPlatform: Platform | Lift | null;
  private platformVelocity: number;

  //@ts-ignore
  public keys: Map<string, Phaser.Input.Keyboard.Key>;
  //@ts-ignore
  public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
    return this.keys;
  }

  constructor(config: PlayerConfig) {
    super(config.scene, config.x, config.y, config.key);

    //console.log(config.key);
    this.inGame = config.inGame;
    if (config.physic) {
      config.scene.physics.world.enable(this);
      this.platformVelocity = 0;
      //@ts-ignore
      this.body.maxVelocity.x = 300;
      //@ts-ignore
      this.body.maxVelocity.y = 800;
      //@ts-ignore
      this.body.setSize(20, 48);
      //@ts-ignore
      this.body.setOffset(15, 20);
      //@ts-ignore
      this.setBounce(0);
    }

    if (config.scene.sys.game.device.input.touch) {
      this.JoyScene = <Joy>config.scene.scene.get("Joy");
    }

    this.commands = config.commands;
    if (!this.commands) this.setImmovable();
    this.currentScene = <GamePlay>config.scene;
    this.key = config.key;
    this.name = config.name;

    let _idleConfig: Phaser.Types.Animations.Animation = {
      key: this.key + "-idle",

      frames: this.currentScene.anims.generateFrameNumbers(this.key, {
        frames: [0, 1, 2, 3]
      }),
      frameRate: 6,
      yoyo: false,
      repeat: -1
    };
    this.currentScene.anims.create(_idleConfig);

    let _runConfig: Phaser.Types.Animations.Animation = {
      key: this.key + "-run",

      frames: this.currentScene.anims.generateFrameNumbers(this.key, {
        frames: [10, 11, 12, 13, 14, 15, 16, 17]
      }),
      frameRate: 10,
      yoyo: false,
      repeat: -1
    };

    this.currentScene.anims.create(_runConfig);

    let _jumpConfig: Phaser.Types.Animations.Animation = {
      key: this.key + "-jump",
      frames: this.currentScene.anims.generateFrameNumbers(this.key, {
        frames: [21, 22, 23, 24, 25, 26, 27, 28, 26, 27, 28, 26, 27, 28]
      }),
      frameRate: 6,
      yoyo: false,
      repeat: 0
    };

    this.currentScene.anims.create(_jumpConfig);

    let _downConfig: Phaser.Types.Animations.Animation = {
      key: this.key + "-down",
      frames: this.currentScene.anims.generateFrameNumbers(this.key, {
        frames: [20]
      }),
      frameRate: 0,
      yoyo: false,
      repeat: 0
    };

    this.currentScene.anims.create(_downConfig);

    this.setOrigin(0.5, 0.5);
    this.setFlipX(false);
    this.keys = new Map([
      ["LEFT", this.addKey("LEFT")],
      ["RIGHT", this.addKey("RIGHT")],
      ["JUMP", this.addKey("SPACE")],
      ["DOWN", this.addKey("DOWN")],
      ["UP", this.addKey("UP")]
    ]);

    this.setInteractive();

    if (!this.inGame) this.setTint(0x333333);

    this.currentScene.add.existing(this);
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.currentScene.input.keyboard.addKey(key);
  }

  update(time: number, delta: number) {
    if (!this.isDying && this.commands && this.body != undefined) {
      //console.log('update', this.isDying)

      if (this.currentScene.sys.game.device.input.touch) {
        this.handleTouchInput(time, delta);
      } else {
        this.handleInput(time, delta);
      }
      this.handleAnimations();
    }

    if (this.body.touching.none) {
      //this.touchingPlatform = false;
    }
    //if (this.body != undefined) this.setDepth(this.y);
    this.setDepth(9);
  }

  private handleInput(time: number, delta: number) {
    if (!this.commands || this.isDying || this.body == undefined) return;
    //@ts-ignore
    if (
      //@ts-ignore
      this.body.onFloor() ||
      //@ts-ignore
      // (this.body.touching.down && this.touchingPlatform) ||
      //@ts-ignore
      this.body.blocked.down
    ) {
      this.isJumping = false;

      //@ts-ignore
      this.body.setAccelerationY(0);
      //@ts-ignore
      this.body.setVelocityY(0);
    }

    if (
      //@ts-ignore
      this.keys.get("JUMP").isDown &&
      !this.isJumping
    ) {
      this.jump();
    }

    // handle movements to left and right
    //@ts-ignore
    if (this.keys.get("RIGHT").isDown) {
      //@ts-ignore
      this.body.setSize(20, 48);
      this.body.setOffset(25, 20);
      //@ts-ignore
      this.body.setAccelerationX(this.acceleration);
      this.setFlipX(false);
      //@ts-ignore
    } else if (this.keys.get("LEFT").isDown) {
      this.body.setSize(20, 48);
      this.body.setOffset(15, 20);
      //@ts-ignore
      this.body.setAccelerationX(-this.acceleration);
      this.setFlipX(true);
      //@ts-ignore
    } else if (this.keys.get("DOWN").isDown) {
      //@ts-ignore
      this.body.setSize(20, 30);
      if (this.flipX) {
        this.body.setOffset(15, 38);
      } else {
        this.body.setOffset(25, 38);
      }

      //@ts-ignore
      this.body.setVelocityX(0);
      //@ts-ignore
      this.body.setAccelerationX(0);
      this.isDown = true;
    } else {
      this.body.setSize(20, 48);
      if (this.flipX) {
        this.body.setOffset(15, 20);
      } else {
        this.body.setOffset(25, 20);
      }

      //@ts-ignore
      this.body.setVelocityX(0);
      //@ts-ignore
      this.body.setAccelerationX(0);
      this.isDown = false;
    }

    if (
      //@ts-ignore
      this.keys.get("DOWN").isDown &&
      !this.isJumping &&
      this.touchedPlatform != null &&
      this.touchedPlatform.isTriggered() &&
      !this.touchedPlatform.isMoving()
    ) {
      this.touchedPlatform.trigger(2);
    }

    if (
      //@ts-ignore
      this.keys.get("UP").isDown &&
      !this.isJumping &&
      this.touchedPlatform != null &&
      this.touchedPlatform.isTriggered() &&
      !this.touchedPlatform.isMoving()
    ) {
      this.touchedPlatform.trigger(0);
    }
  }

  private handleAnimations(): void {
    if (!this.commands || this.isDying || this.body == undefined) return;
    //@ts-ignore
    if (
      this.body.velocity.y !== 0 &&
      !this.body.blocked.down &&
      !this.touchingPlatform
    ) {
      this.anims.play(this.key + "-jump", true);
      //@ts-ignore
    } else if (this.body.velocity.x !== 0 && !this.isJumping) {
      this.anims.play(this.key + "-run", true);
      //@ts-ignore
    } else if (this.body.velocity.x === 0 && !this.isJumping && this.isDown) {
      this.anims.play(this.key + "-down", true);
    } else if (
      //@ts-ignore
      this.body.onFloor() ||
      //@ts-ignore
      this.touchingPlatform ||
      //@ts-ignore
      this.body.blocked.down
    ) {
      //console.log("idle");
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
    //@ts-ignore
    this.body.setImmovable(false);
  }

  setCommands(command: boolean): void {
    this.commands = command;
  }

  jumpOverEnemy() {
    // console.log('jumpOverEnemy')
    //@ts-ignore
    this.body.setVelocityY(-600);
  }

  isActive(): boolean {
    return this.commands;
  }

  die(): void {
    //console.log('die')
    this.isDying = true;
    //console.log(this.isDying)

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
    // console.log('gameover')
    this.destroy(true);
  }

  isTouchingPlatform(_platform: Platform | Lift): void {
    this.touchingPlatform = true;
    this.isJumping = false;
    this.touchedPlatform = _platform;
    //this.y = this.y + 10;
    //console.log(_platform);
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

  private handleTouchInput(time: number, delta: number) {
    if (!this.commands || this.isDying || this.body == undefined) return;
    //@ts-ignore
    if (
      //@ts-ignore
      this.body.onFloor() ||
      //@ts-ignore
      //this.body.touching.down ||
      //@ts-ignore
      this.body.blocked.down
    ) {
      this.isJumping = false;
      //@ts-ignore
      this.body.setVelocityY(0);
    }

    //@ts-ignore
    if (this.JoyScene.stick && this.JoyScene.stick.direction === Phaser.RIGHT) {
      //@ts-ignore
      if (this.inGame) this.body.setOffset(25, 20);
      //@ts-ignore
      this.body.setAccelerationX(this.acceleration);
      this.setFlipX(false);
      //@ts-ignore
    } else if (
      this.JoyScene.stick &&
      this.JoyScene.stick.direction === Phaser.LEFT
    ) {
      //@ts-ignore
      if (this.inGame) this.body.setOffset(15, 20);
      //@ts-ignore
      this.body.setAccelerationX(-this.acceleration);
      this.setFlipX(true);
      this.isDown = false;
    } else {
      //@ts-ignore
      this.body.setVelocityX(0);
      //@ts-ignore
      this.body.setAccelerationX(0);
      this.body.velocity.y = 0;
    }

    this.jumpTimer -= delta;

    //@ts-ignore
    if (this.JoyScene.jump.isDown && (!this.isJumping || this.jumpTimer > 0)) {
      this.jump();
      //@ts-ignore
    } else if (!this.JoyScene.jump.isDown) {
      this.jumpTimer = -1; // Don't resume jump if button is released, prevents mini double-jumps
      //@ts-ignore
      if (this.body.blocked.down) {
        this.isJumping = false;
      }
    }
  }

  private jump() {
    if (!this.isJumping) {
      this.currentScene.sound.playAudioSprite("sfx", "smb_jump-small", {
        volume: 0.3
      });
    }

    //@ts-ignore
    if (
      this.body.velocity.y <= 0 ||
      (this.body.touching.down && this.touchingPlatform) ||
      this.body.blocked.down ||
      !this.isJumping
    ) {
      this.touchingPlatform = false;
      this.touchedPlatform = null;

      console.log(-600 + this.platformVelocity);
      //@ts-ignore
      this.body.setVelocityY(-600 + this.platformVelocity * -1);
    }
    this.isJumping = true;
  }

  addVelocity(velocity: number): void {
    this.platformVelocity = velocity;
  }
}
