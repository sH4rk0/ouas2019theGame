/**
 * @author       Francesco Raimondo <francesco.raimondo@gmail.com>
 * @copyright    2019 zero89
 * @description  ouas2019
 * @license      zero89
 */

import GamePlay from "../../scenes/GamePlay";

export class Lift extends Phaser.GameObjects.Sprite {
  // variables
  protected currentScene: GamePlay;
  private params: LiftValues;
  private liftTween: Phaser.Tweens.Tween;
  private start: number;
  private startX: number;
  private startY: number;
  private currentStep: number;
  private _isMoving: boolean;
  private steps: Array<{ r: number; v: number }>;

  constructor(params: LiftConfig) {
    super(params.scene, params.x, params.y, params.key);

    this.currentScene = <GamePlay>params.scene;
    if (params.values.start != null) this.start = params.values.start;
    this.startX = params.x;
    this.startY = params.y;
    this.name = params.name;
    this.params = params.values;

    this.currentStep = 0;
    if (this.params.start != undefined) this.currentStep = this.params.start;
    if (this.params.steps != null) this.steps = this.params.steps;
    this.currentScene.physics.world.enable(this);

    this._isMoving = false;
    //@ts-ignore
    this.body.setImmovable(true);
    //@ts-ignore
    this.body.setAllowGravity(false);
    //@ts-ignore
    this.body.checkCollision.up = true;
    //@ts-ignore
    this.body.checkCollision.down = false;
    //@ts-ignore
    this.body.checkCollision.left = false;
    //@ts-ignore
    this.body.checkCollision.right = false;

    this.setOrigin(0, 1);

    this.currentScene.add.existing(this);
  }

  preUpdate() {
    //@ts-ignore
    if (this.body.touching.up && !this.currentScene.player.isJump()) {
      if (this.currentScene.player.body.velocity.y !== 0) {
        this.currentScene.player.body.velocity.y = 0;
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
  }

  isTriggered(): boolean {
    return true;
  }

  isMoving(): boolean {
    return this._isMoving;
  }

  reset(): void {
    this.currentScene.tweens.add({
      targets: this,
      x: this.startX,
      y: this.startY,
      duration: 500
    });

    this.currentStep = this.start;
    //console.log(this.start, this.currentStep);
  }

  trigger(value: number): void {
    if (
      (this.currentStep - 1 < 0 && value == 2) ||
      (this.currentStep == this.steps.length - 1 && value == 0)
    )
      return;

    this._isMoving = true;
    if (value == 0) {
      this.liftTween = this.scene.tweens.add({
        targets: this,
        y: this.y - this.steps[this.currentStep].r * 32,
        duration: this.steps[this.currentStep].v,
        ease: "Sine.easeIn",
        onUpdate: (values: any) => {
          //@ts-ignore
          if (this.body.touching.up && !this.currentScene.player.isJump()) {
            this.currentScene.player.y = this.y - 64;
          }
        },
        onComplete: () => {
          this.currentStep += 1;
          this._isMoving = false;

          //console.log(value, this.currentStep, this.steps.length);
        }
      });
    } else {
      this.liftTween = this.scene.tweens.add({
        targets: this,
        y: this.y + this.steps[this.currentStep - 1].r * 32,
        duration: this.steps[this.currentStep - 1].v,
        ease: "Sine.easeIn",
        onUpdate: (values: any) => {
          //@ts-ignore
          if (this.body.touching.up && !this.currentScene.player.isJump()) {
            this.currentScene.player.y = this.y - 64;
          }
        },
        onComplete: () => {
          this.currentStep -= 1;
          this._isMoving = false;

          // console.log(value, this.currentStep, this.steps.length);
        }
      });
    }
  }
}
