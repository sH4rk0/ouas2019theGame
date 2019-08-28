import GamePlay from "../../scenes/GamePlay";

export class Searching extends Phaser.GameObjects.Container {
  // variables
  protected currentScene: GamePlay;
  protected searchValue: number;
  protected searchBox: Phaser.GameObjects.Image;
  protected searchBar: Phaser.GameObjects.Image;
  protected searchText: Phaser.GameObjects.BitmapText;
  constructor(params: SearchingConfig) {
    super(params.scene);

    // variables

    this.currentScene = <GamePlay>params.scene;
    this.searchValue = 150;

    this.searchBox = this.currentScene.add.image(0, 0, "search-box");
    this.searchBar = this.currentScene.add.image(0, 0, "search-bar");
    this.searchBar.setOrigin(0, 1);
    this.searchText = this.currentScene.add
      .bitmapText(0, 0, "commodore", `Searching`, 16)
      .setTint(0x00000);

    Phaser.Display.Align.In.Center(this.searchText, this.searchBox, 0, -20);
    Phaser.Display.Align.In.Center(this.searchBar, this.searchBox, 0, 20);

    this.add([this.searchBox, this.searchBar, this.searchText]);

    this.currentScene.add.existing(this);
  }

  //200:start=x:current

  setValue(start: number, current: number): void {
    console.log((current * 200) / start);
    this.searchBar.setDisplaySize((current * 200) / start, 20);
  }
}
