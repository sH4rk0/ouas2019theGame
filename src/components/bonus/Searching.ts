import GamePlay from "../../scenes/GamePlay";

export class Searching extends Phaser.GameObjects.Container {
  // variables
  protected currentScene: GamePlay;
  protected searchValue: number;
  protected searchBox: Phaser.GameObjects.Image;
  protected searchBar: Phaser.GameObjects.Image;
  protected searchText: Phaser.GameObjects.Text;
  constructor(params: SearchingConfig) {
    super(params.scene);

    // variables

    this.currentScene = <GamePlay>params.scene;
    this.searchValue = 150;

    this.searchBox = this.currentScene.add.image(0, 0, "search-box");
    this.searchBar = this.currentScene.add.image(0, 0, "search-bar");
    this.searchBar.setOrigin(0, 1);

    const _config = {
      font: "15px",
      fill: "#000000",
      wordWrap: { width: 150, useAdvancedWrap: true }
    };

    this.searchText = this.currentScene.add
      .text(0, 0, `Searching`, _config)
      .setFontFamily('"Press Start 2P"');

    Phaser.Display.Align.In.Center(this.searchText, this.searchBox, 0, -20);
    Phaser.Display.Align.In.Center(this.searchBar, this.searchBox, 0, 20);
    this.add([this.searchBox, this.searchBar, this.searchText]);
    this.currentScene.add.existing(this);
  }

  //200:start=x:current

  setValue(start: number, current: number): void {
    this.searchBar.setDisplaySize((current * 200) / start, 20);
  }

  show(values: { startValue: number; currentValue: number }): void {
    this.setAlpha(1);
    this.searchText.setText("Searching");
    this.setValue(values.startValue, values.currentValue);
    this.setPosition(
      this.currentScene.player.x,
      this.currentScene.player.y - 64
    );
  }
  hide(): void {
    this.currentScene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.setPosition(-100, -100);
      }
    });
  }

  setResult(found: number): void {
    //0: nothing
    //1: trigger
    //2: random
    console.log(found);
    switch (found) {
      case 0:
        if (Phaser.Math.RND.integerInRange(0, 100) > 50) {
          const _time = Phaser.Math.RND.integerInRange(10, 20);
          this.currentScene.registry.values.time =
            this.currentScene.registry.values.time + _time;
          this.searchText.setText(`You found +${_time} time bonus`);
          this.currentScene.respawnTime += _time;
        } else {
          this.searchText.setText("You found nothing!");
        }

        break;

      case 1:
        this.searchText.setText("You found an hidden lever!");
        break;
    }

    this.currentScene.time.addEvent({
      delay: 1500,
      callback: () => {
        this.hide();
      }
    });
  }
}
