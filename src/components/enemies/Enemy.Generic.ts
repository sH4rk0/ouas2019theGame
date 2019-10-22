import { Enemy } from "./enemy";

export class EnemyGeneric extends Enemy {
  protected direction: boolean = false;
  constructor(params: EnemyConfig) {
    super(params);

    //console.log(params);
    this.speed = Phaser.Math.RND.integerInRange(45, 55);
    this.dyingScoreValue = 50;
    this.setScale(2);
    //@ts-ignore
    //this.body.setSize(30, 48);
    //@ts-ignore
    //this.body.setOffset(15, 20);
    this.setOrigin(0.5, 0);
    this.setFrame(0);
    if (params.name != null) this.name = params.name;
    //@ts-ignore
    this.body.setImmovable(true);

    let _walkConfig: Phaser.Types.Animations.Animation = {
      key: params.key + "-walk",
      frames: this.currentScene.anims.generateFrameNumbers(params.key, {
        frames: [0, 1]
      }),
      frameRate: 4,
      yoyo: false,
      repeat: -1
    };

    this.currentScene.anims.create(_walkConfig);

    this.play(params.key + "-walk");
  }

  update(): void {
    this.setDepth(this.y);
    if (!this.isDying) {
      if (this.isActivated) {
        // @ts-ignore
        this.body.setVelocityX(-this.speed);

        /*
        //@ts-ignore
        if (this.body.blocked.right || this.body.blocked.left) {
          this.speed = -this.speed;
          //@ts-ignore
          this.body.velocity.x = this.speed;
          this.direction = !this.direction;
          this.setFlipX(this.direction);
        }
      } else {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            this.getBounds(),
            this.currentScene.cameras.main.worldView
          )
        ) {
          this.isActivated = true;
        }
      }
    } else {
      this.anims.stop();
      //@ts-ignore
      this.body.setVelocity(0, 0);
      //@ts-ignore
      this.body.checkCollision.none = true;
    }

  */
      }
    }
  }

  makeActive() {
    this.isActivated = true;
  }

  changeDirection() {
    this.speed = -this.speed;
    //@ts-ignore
    this.body.velocity.x = this.speed;
    this.direction = !this.direction;
    this.setFlipX(this.direction);
  }

  public gotHitOnHead(): void {
    this.isDying = true;
    this.anims.stop();

    this.currentScene.time.addEvent({
      delay: 500,
      callback: () => {
        this.currentScene.add.tween({
          targets: this,
          alpha: 0,
          ease: "Default",
          duration: 200,
          onComplete: () => {
            this.isDead();
          }
        });
      }
    });
  }

  protected isDead(): void {
    this.destroy();
  }
}
