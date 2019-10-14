import GamePlay from "../../scenes/GamePlay";
import { TileAnimator } from "./TileAnimator";
import { GameData } from "../../GameData";
import { Lift } from "../obstacles/Lift";

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
                  GameData.triggers[tile.name],
                  this.status
                );
              }
            });
          },
          callbackScope: this
        });

        break;

      case "lift-reset":
        //console.log("lift-reset");
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,
          callback: () => {
            this.currentScene
              .getPlatforms()
              .forEach((tile: Lift, index: number) => {
                //console.log(tile.name, timelineElement.target);
                if (tile.name === timelineElement.target) {
                  tile.reset();
                }
              });
          },
          callbackScope: this
        });

        break;

      case "lever":
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,
          callback: () => {
            this.currentScene.mapLevers.forEach((tile: any, index: number) => {
              if (tile.name === timelineElement.target) {
                //console.log(timelineElement);
                if (timelineElement.status != undefined)
                  this.status = timelineElement.status;

                new TileAnimator(
                  this.currentScene,
                  tile,
                  GameData.triggers[tile.name],
                  this.status,
                  timelineElement.anim
                );
              }
            });
          },
          callbackScope: this
        });

        break;

      case "doors-reset":
        this.currentScene.mapDoors.forEach((tile: any, index: number) => {
          new TileAnimator(
            this.currentScene,
            tile,
            GameData.triggers[tile.name],
            tile.type
          );
        });

        break;

      case "teleport":
        //console.log(timelineElement);
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,
          callback: () => {
            this.currentScene.mapTeleports.forEach(
              (tile: any, index: number) => {
                if (tile.name === timelineElement.target) {
                  this.currentScene.player.setX(tile.x);
                  this.currentScene.player.setY(tile.y);
                }
              }
            );
          }
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

      case "start-timer":
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,

          callback: () => {
            this.currentScene.startTimer();
          }
        });
        break;

      case "play-music":
        console.log("play-music", timelineElement.delay);
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,

          callback: () => {
            this.currentScene.startMusic();
          }
        });
        break;

      case "play-audio":
        console.log("play-audio", timelineElement);
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,
          callback: () => {
            let _volume = 1;

            if (timelineElement.volume != undefined)
              _volume = timelineElement.volume;

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

      case "respawn":
        this.currentScene.setRespawn(timelineElement.respawn);
        break;

      case "trigger-copy":
        this.currentScene.time.addEvent({
          delay: timelineElement.delay,

          callback: () => {
            GameData.triggers[timelineElement.to] =
              GameData.triggers[timelineElement.from];
          }
        });

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
                this.currentScene.followPlayer();

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
