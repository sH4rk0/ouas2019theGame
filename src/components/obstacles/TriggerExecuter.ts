import GamePlay from "../../scenes/GamePlay";
import { TileAnimator } from "./TileAnimator";
import { GameData } from "../../GameData";
import { Lift } from "../obstacles/Lift";
import { EnemyGeneric } from "../enemies/Enemy.Generic";

export class TriggerExecuter {
  private currentScene: GamePlay;
  private status: string;

  constructor(scene: GamePlay) {
    this.currentScene = scene;
  }

  executer(timeline: Array<any>): void {
    timeline.forEach(element => {
      this.execute(element);
    });
  }

  execute(timelineElement: any): void {
    this.currentScene.time.addEvent({
      delay: timelineElement.delay,
      callback: () => {
        switch (timelineElement.type) {
          case "door":
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

            break;

          case "showJumpTip":
            console.log("trigger");
            this.currentScene.emit("showJumpTip");
            break;

          case "showSearchTip":
            this.currentScene.emit("showSearchTip");
            break;

          case "active-enemy":
            this.currentScene
              .getEnemies()
              .forEach((enemy: EnemyGeneric, index: number) => {
                if (enemy.name === timelineElement.target) {
                  enemy.makeActive();
                }
              });
            break;

          case "lift-reset":
            this.currentScene
              .getPlatforms()
              .forEach((tile: Lift, index: number) => {
                if (tile.name === timelineElement.target) {
                  tile.reset();
                }
              });

            break;

          case "lever":
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
            this.currentScene.mapTeleports.forEach(
              (tile: any, index: number) => {
                if (tile.name === timelineElement.target) {
                  this.currentScene.sound.add("tele-in").play(undefined, {
                    loop: false,
                    volume: 0.05
                  });

                  this.currentScene.player.setPlayerImmovable();
                  this.currentScene.player.setAlpha(0);
                  this.currentScene.time.addEvent({
                    delay: 1500,
                    callback: () => {
                      this.currentScene.sound.add("tele-out").play(undefined, {
                        loop: false,
                        volume: 0.05
                      });
                      this.currentScene.player.setX(tile.x);
                      this.currentScene.player.setY(tile.y);
                      this.currentScene.player.setMovable();
                      this.currentScene.player.setAlpha(1);
                    },
                    callbackScope: this
                  });
                }
              }
            );

            break;

          case "camera-shake":
            var tween = this.currentScene.tweens.add({
              targets: this.currentScene.cameras.main,
              y: this.currentScene.cameras.main.y - 30,
              ease: "Sine.sineInOut",
              duration: 20,
              repeat: 3,
              yoyo: true
            });

            break;

          case "start-timer":
            this.currentScene.startTimer();

            break;

          case "pause-timer":
            this.currentScene.pauseTimer();
            break;

          case "play-timer":
            this.currentScene.playTimer();
            break;

          case "play-music":
            this.currentScene.startMusic();

            break;

          case "play-audio":
            let _volume = 1;

            if (timelineElement.volume != undefined)
              _volume = timelineElement.volume;

            this.currentScene.sound.add(timelineElement.key).play(undefined, {
              loop: timelineElement.loop,
              volume: _volume
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
            GameData.triggers[timelineElement.to] =
              GameData.triggers[timelineElement.from];

            break;

          case "player-immovable":
            this.currentScene.player.setPlayerImmovable();
            this.currentScene.cameras.main.stopFollow();

            break;

          case "player-movable":
            this.currentScene.player.setMovable();
            this.currentScene.followPlayer();

            break;

          case "camera-pan":
            this.currentScene.mapDoors.forEach((tile: any, index: number) => {
              if (tile.name === timelineElement.target) {
                this.currentScene.cameras.main.pan(
                  tile.x,
                  tile.y,
                  timelineElement.speed
                );
              }
            });

            break;
          case "camera-zoom-in":
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
            //this.currentScene.player.setPlayerImmovable();
            //this.currentScene.cameras.main.stopFollow();

            this.currentScene.cameras.main.pan(
              this.currentScene.player.x,
              this.currentScene.player.y + timelineElement.delta,
              700
            );

            break;
          case "game-completed":
            this.currentScene.gameCompleted();
            break;

          case "hide-hud":
            this.currentScene.hideHud();
            break;

          case "camera-zoom-out":
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

            break;
        }
      },
      callbackScope: this
    });
  }
}
