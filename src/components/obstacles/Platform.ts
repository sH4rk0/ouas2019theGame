/**
 * @author       Francesco Raimondo <francesco.raimondo@gmail.com>
 * @copyright    2019 zero89
 * @description  ouas2019
 * @license      zero89
 */

import GamePlay from "../../scenes/GamePlay";

export class Platform extends Phaser.GameObjects.Sprite {
  // variables
  protected currentScene: GamePlay;
  private startPosition: number;
  private endPosition: number;
  private params: PlatformValues;
  private yoyo: boolean;
  private repeat: number;
  private tween: Phaser.Tweens.Tween;
  private triggered: boolean;
  private velocity: number;

  private path: Phaser.Curves.Ellipse;
  private pathIndex: number;
  private pathSpeed: number;
  private pathVector: Phaser.Math.Vector2;
  private deltaX: number;
  private deltaY: number;

  constructor(params: PlatformConfig) {
    super(params.scene, params.x, params.y, params.key);

    this.currentScene = <GamePlay>params.scene;
    this.params = params.values;
    this.currentScene.physics.world.enable(this);

    //@ts-ignore
    this.body.setImmovable(true);
    //@ts-ignore
    this.body.setAllowGravity(false);
    //@ts-ignore
    this.body.setSize(128, 32);
    //@ts-ignore
    this.body.checkCollision.up = true;
    //@ts-ignore
    this.body.checkCollision.down = false;
    //@ts-ignore
    this.body.checkCollision.left = false;
    //@ts-ignore
    this.body.checkCollision.right = false;

    let _rangeY: number = 0;
    if (this.params.rangeY != null) _rangeY = this.params.rangeY;

    let _rangeX: number = 0;
    if (this.params.rangeX != null) _rangeX = this.params.rangeX;

    this.path = new Phaser.Curves.Ellipse(
      params.x + _rangeX / 2,
      params.y - _rangeY / 2,
      _rangeX / 2,
      _rangeY / 2
    );
    this.pathIndex = 1;
    this.pathSpeed = 0.01;
    if (this.params.velocity != null) this.pathSpeed = this.params.velocity;
    this.pathVector = new Phaser.Math.Vector2();

    this.path.getPoint(0, this.pathVector);
    this.setPosition(this.pathVector.x, this.pathVector.y);

    this.setOrigin(0, 1);
    // variables

    this.currentScene.add.existing(this);
  }

  preUpdate() {
    //@ts-ignore
    if (this.body.touching.up && !this.currentScene.player.isJump()) {
      //@ts-ignore
      this.currentScene.player.y = this.y - 64;
      this.currentScene.player.x += this.deltaX * -1;
      if (this.currentScene.player.body.velocity.x !== 0) {
        this.currentScene.player.body.velocity.y = 0;
      }
      if (this.deltaY > 0) {
        this.currentScene.player.addVelocity(this.deltaY * 50);
      } else {
        this.currentScene.player.addVelocity(0);
      }
    }
  }

  update() {
    //@ts-ignore
    if (!this.body.touching.up) {
      this.currentScene.player.notTouchingPlatform();
      //@ts-ignore
      this.body.checkCollision.down = false;
    } else {
      //@ts-ignore
      this.body.checkCollision.down = true;
    }
    this.path.getPoint(this.pathIndex, this.pathVector);

    this.deltaX = this.x - this.pathVector.x;
    this.deltaY = this.y - this.pathVector.y;

    this.setPosition(this.pathVector.x, this.pathVector.y);

    this.pathIndex = Phaser.Math.Wrap(this.pathIndex + this.pathSpeed, 0, 1);
  }

  isTriggered(): boolean {
    return false;
  }

  isMoving(): boolean {
    return true;
  }

  trigger(value: number): void {}
}
