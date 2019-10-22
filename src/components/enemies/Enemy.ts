import GamePlay from "../../scenes/GamePlay";

export class Enemy extends Phaser.GameObjects.Sprite {
  // variables
  protected currentScene: GamePlay;
  protected speed: number;
  protected dyingScoreValue: number;
  protected isDying: boolean;
  protected isActivated: boolean;

  constructor(params: EnemyConfig) {
    super(params.scene, params.x, params.y, params.key);

    // variables
    this.currentScene = <GamePlay>params.scene;
    this.initSprite();
    this.isActivated = false;

    this.currentScene.add.existing(this);
  }

  protected initSprite() {
    // variables
    this.isDying = false;
    this.currentScene.physics.world.enable(this);
    //@ts-ignore
  }
}
