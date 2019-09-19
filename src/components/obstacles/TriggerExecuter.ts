import GamePlay from "../../scenes/GamePlay";
import { TileAnimator } from "./TileAnimator";

export class TriggerExecuter {
  private currentScene: GamePlay;
  private status: string;
  constructor(scene: GamePlay) {
    this.currentScene = scene;
  }

  execute(timelineElement: any): void {
    switch (timelineElement.type) {
      case "door":
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,
          callback: () => {
            this.currentScene.mapDoors.forEach((tile: any, index: number) => {
              if (tile.name === timelineElement.target) {
                if (timelineElement.status != undefined)
                  this.status = timelineElement.status;
                new TileAnimator(
                  this.currentScene,
                  tile,
                  JSON.parse(tile.type),
                  this.status
                );
              }
            });
          },
          callbackScope: this
        });

        break;

      case "camera-shake":
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,
          callback: () => {
            // console.log("camera shake");
            //this.currentScene.cameras.main.shake(200, 0.005, false);

            var tween = this.currentScene.tweens.add({
              targets: this.currentScene.cameras.main,
              y: this.currentScene.cameras.main.y - 30,
              ease: "Sine.sineInOut",
              duration: 20,
              repeat: 3,
              yoyo: true
            });
          },
          callbackScope: this
        });
        break;

      //{"type":"switch","width":2,"height":6,"inactive":300,"status":"off","timelineOn":[{"type":"camera-shake","value":1,"delay":250},{"type":"door","target":"enter-door","status":"on","delay":0}],"timelineOff":[{"type":"door","target":"enter-door","status":"off","delay":0}]}

      //{"type":"once","width":2,"height":6,"timeline":[{"type":"camera-shake","value":1,"delay":250},{"type":"door","target":"enter-door","status":"on","delay":0},{"type":"play-audio","delay":200,"key":"close-door"},{"type":"camera-zoom-in","delay":600,"duration":1000},{"type":"play-audio","delay":2000,"key":"anothervisitor","loop":false},{"type":"play-audio","delay":9000,"key":"loop","loop":true,"volume":0.2},{"type":"camera-zoom-out","delay":9000}]}

      case "play-audio":
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,
          callback: () => {
            let _volume = 1;

            if (timelineElement.volume != undefined)
              _volume = timelineElement.volume;

            console.log(_volume);
            //@ts-ignore
            this.currentScene.sound.add(timelineElement.key).play(undefined, {
              loop: timelineElement.loop,
              volume: _volume
            });
          },
          callbackScope: this
        });

        break;

      case "pause-audio":
        break;

      case "resume-audio":
        break;

      case "camera-zoom-in":
        this.currentScene.player.setPlayerImmovable();
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,
          callback: () => {
            var tween = this.currentScene.tweens.add({
              targets: this.currentScene.blackTop,
              y: 50,
              ease: "Sine.sineIn",
              duration: 500,
              delay: 200,
              repeat: 0
            });

            var tween = this.currentScene.tweens.add({
              targets: this.currentScene.blackBottom,
              y: 720 - 200,
              ease: "Sine.sineIn",
              duration: 500,
              repeat: 0,
              delay: 200
            });

            this.currentScene.tweens.addCounter({
              from: 1,
              to: 1.5,
              ease: "Sine.sineInOut",
              duration: 700,
              onUpdate: (tween: Phaser.Tweens.Tween) => {
                this.currentScene.cameras.main.setZoom(tween.getValue());
              }
            });

            this.currentScene.cameras.main.stopFollow();

            this.currentScene.cameras.main.pan(
              this.currentScene.player.x,
              this.currentScene.player.y,
              700
            );
          },
          callbackScope: this
        });
        break;

      case "camera-zoom-out":
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,
          callback: () => {
            var tween = this.currentScene.tweens.add({
              targets: this.currentScene.blackTop,
              y: -150,
              ease: "Sine.sineOut",
              duration: 500,
              delay: 0,
              repeat: 0
            });

            var tween = this.currentScene.tweens.add({
              targets: this.currentScene.blackBottom,
              y: 720,
              ease: "Sine.sineOut",
              duration: 500,
              repeat: 0,
              delay: 0
            });

            this.currentScene.tweens.addCounter({
              from: 1.5,
              to: 1,
              ease: "Sine.sineInOut",
              duration: 700,
              onUpdate: (tween: Phaser.Tweens.Tween) => {
                this.currentScene.cameras.main.setZoom(tween.getValue());
              },
              onComplete: () => {
                this.currentScene.cameras.main.startFollow(
                  this.currentScene.player,
                  false,
                  0.08,
                  0.08,
                  undefined,
                  32 * 4
                );
                this.currentScene.player.setMovable();
              }
            });

            this.currentScene.cameras.main.pan(
              this.currentScene.player.x,
              this.currentScene.player.y - 32 * 4,
              700
            );
          },
          callbackScope: this
        });

        break;
    }
  }
}
