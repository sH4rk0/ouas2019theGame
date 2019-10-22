import GamePlay from "../../scenes/GamePlay";

export class Item extends Phaser.Physics.Arcade.Sprite {
  // variables
  protected currentScene: GamePlay;
  protected searchValue: number;
  protected startValue: number;
  protected hasKey: boolean;
  protected options: any;

  constructor(params: ItemConfig) {
    super(params.scene, params.x, params.y, params.key);

    // variables

    this.currentScene = <GamePlay>params.scene;
    this.options = params.options;

    this.name = "Item";
    this.hasKey = false;
    this.initItem();
    this.setFrame(Phaser.Math.RND.integerInRange(0, 1));

    this.searchValue = Phaser.Math.RND.integerInRange(100, 200);
    this.startValue = this.searchValue;

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
    //this.currentScene.searching.setPosition(-100, -100);
    this.currentScene.searching.hide();
  }

  hasTrigger() {
    if (this.options.trigger != null) return true;
    return false;
  }

  setKey(): void {
    this.hasKey = true;
  }

  searching(): void {
    this.searchValue -= 1;

    this.currentScene.searching.show({
      startValue: this.startValue,
      currentValue: this.searchValue
    });

    if (this.searchValue == 0) {
      if (this.hasKey) {
        this.currentScene.triggerExecuter.executer(this.options.trigger);
      }
      this.currentScene.physics.world.disable(this);

      this.currentScene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          if (this.hasKey) {
            this.currentScene.searching.setResult(1);
          } else {
            this.currentScene.searching.setResult(0);
          }
          this.destroy();
          this.currentScene.player.setSearch(false);
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
