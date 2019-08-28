import GamePlay from "../../scenes/GamePlay";

export class Item extends Phaser.Physics.Arcade.Sprite {
  // variables
  protected currentScene: GamePlay;
  protected searchValue: number;
  protected startValue: number;

  constructor(params: ItemConfig) {
    super(params.scene, params.x, params.y, params.key);

    // variables

    this.currentScene = <GamePlay>params.scene;
    this.name = "Item";
    this.initItem();
    this.searchValue = 150;
    this.startValue = 150;

    this.currentScene.add.existing(this);
  }

  protected initItem() {
    this.setOrigin(0, 1);
    // variables

    this.currentScene.physics.world.enable(this);

    //@ts-ignore
    this.body.setAllowGravity(false).setImmovable(true);
  }

  stopSearching(): void {
    this.currentScene.searching.setPosition(-100, -100);
  }

  searching(): void {
    this.searchValue -= 1;

    this.currentScene.searching.setValue(this.startValue, this.searchValue);

    this.currentScene.searching.setPosition(
      this.currentScene.player.x,
      this.currentScene.player.y - 64
    );

    if (this.searchValue == 0) {
      this.currentScene.physics.world.disable(this);

      this.currentScene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.currentScene.searching.setPosition(-100, -100);
          this.destroy();
        }
      });
    }
    /*
    this.currentScene.add.tween({
      targets: scoreText,
      props: { y: scoreText.y - 50, alpha: 0 },
      duration: 500,
      ease: "Power2",
      yoyo: false,
      onComplete: () => {
        scoreText.destroy();
      }
    });
    */
  }
}
