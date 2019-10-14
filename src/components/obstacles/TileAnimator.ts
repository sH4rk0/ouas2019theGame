import "phaser";
import GamePlay from "../../scenes/GamePlay";

export class TileAnimator {
  // variables
  protected currentScene: GamePlay;
  private triggered: boolean = false;
  private anim: Array<{
    tileId: number;
    delay: number;
    i: number;
  }>;
  private start: string;

  constructor(
    scene: Phaser.Scene,
    tile: any,
    animation: TileAnimation,
    start: string,
    type?: string
  ) {
    this.currentScene = <GamePlay>scene;

    this.start = start;
    this.anim = [];

    if (this.start == "on") {
      this.anim = animation.animOn;
    } else {
      this.anim = animation.animOff;
    }

    if (type == null) type = "door";

    switch (type) {
      case "single":
        //console.log(tile, start, type, animation);
        this.anim.forEach(
          (
            element: { tileId: number; delay: number; i: number },
            index: number
          ) => {
            this.currentScene.time.addEvent({
              delay: element.delay * (index + 1),
              callback: () => {
                this.currentScene.map.putTileAt(
                  element.tileId,
                  tile.x / 32,
                  tile.y / 32,
                  true,
                  "collision"
                );
              }
            });
          }
        );

        break;

      case "door":
        this.anim.forEach(
          (
            element: { tileId: number; delay: number; i: number },
            index: number
          ) => {
            this.currentScene.time.addEvent({
              delay: element.delay * (index + 1),
              callback: () => {
                if (this.start == "on") {
                  this.currentScene.map.putTileAt(
                    element.tileId,
                    tile.x / 32,
                    tile.y / 32 + element.i - 1,
                    true,
                    "collision"
                  );

                  this.currentScene.layer2.setCollision(
                    element.tileId,
                    true,
                    true
                  );
                } else {
                  this.currentScene.map.removeTileAt(
                    tile.x / 32,
                    tile.y / 32 + element.i - 1,
                    true,
                    true,
                    "collision"
                  );
                }
              }
            });
          }
        );

        break;
    }
  }
}
