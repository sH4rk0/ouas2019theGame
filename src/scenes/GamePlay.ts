/**
 * @author       Francesco Raimondo <francesco.raimondo@gmail.com>
 * @copyright    2019 zero89
 * @description  Run4Mayor
 * @license      zero89
 */

import { Player } from "../components/Player";
import { Bonus } from "../components/bonus/Bonus";
import { Bonus1Up } from "../components/bonus/Bonus1Up";
import { Platform } from "../components/obstacles/Platform";
import { Lift } from "../components/obstacles/Lift";
import { Trigger } from "../components/obstacles/Trigger";
import { Enemy } from "../components/enemies/Enemy";
import { Item } from "../components/bonus/Item";
import { EnemyGeneric } from "../components/enemies/Enemy.Generic";
import { GameData } from "../GameData";
import { Searching } from "../components/bonus/Searching";

export default class GamePlay extends Phaser.Scene {
  public player: Player;
  public searching: Searching;
  private isTweenBg: boolean;
  public map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  public layer: Phaser.Tilemaps.StaticTilemapLayer;
  public layer2: Phaser.Tilemaps.DynamicTilemapLayer;
  public layer3: Phaser.Tilemaps.StaticTilemapLayer;
  public currentPlayer: Player;

  private bg: Phaser.GameObjects.TileSprite;
  private bg2: Phaser.GameObjects.TileSprite;
  private bg3: Phaser.GameObjects.TileSprite;
  private bg4: Phaser.GameObjects.Shader;
  private hand: Phaser.GameObjects.Image;

  private mist1: Phaser.GameObjects.TileSprite;
  private mist2: Phaser.GameObjects.TileSprite;
  private mist3: Phaser.GameObjects.TileSprite;

  public blackTop: Phaser.GameObjects.Image;
  public blackBottom: Phaser.GameObjects.Image;

  public ouas: Phaser.GameObjects.Image;

  public startText: Phaser.GameObjects.BitmapText;
  public startTextTween: Phaser.Tweens.Tween;

  private clouds: Array<Phaser.GameObjects.TileSprite> = [];
  private mapScaleFactor: number = 1;
  private groupEnemy: Phaser.GameObjects.Group;
  private groupBonus: Phaser.GameObjects.Group;
  private groupPlatform: Phaser.GameObjects.Group;
  private groupTrigger: Phaser.GameObjects.Group;
  private groupItems: Phaser.GameObjects.Group;
  public mapDoors: Array<Phaser.Tilemaps.Tile>;
  public mapTriggers: Array<Phaser.Tilemaps.Tile>;

  private rt: any;
  private bgtest: any;
  private shader: any;

  private isGameOver: boolean = false;
  private level: LevelConfig;
  //private brickTile: BrickTile;
  private music: Phaser.Sound.BaseSound;
  private blockEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private questionTileBonus: number;
  private delucaHits: number = 0;
  public delucaMaxHits: number = 10;

  constructor() {
    super({
      key: "GamePlay"
    });
  }

  preload() {
    // this.load.scenePlugin('animatedTiles', 'assets/js/AnimatedTiles.min.js', 'animatedTiles', 'animatedTiles')ù

    this.load.scenePlugin(
      "AnimatedTiles",
      "assets/js/AnimatedTiles.js",
      "",
      "animatedTiles"
    );

    this.load.glsl("bundle", "assets/shaders/bundle3.glsl.js");
  }

  create() {
    //console.log("create gameplay");
    this.clouds = [];

    this.level = GameData.levels[this.registry.get("level") - 1];
    this.delucaHits = 0;

    this.registry.set("player", "salvini");
    this.level = GameData.levels[0];

    //console.log(this.level)

    this.questionTileBonus = Phaser.Math.RND.integerInRange(0, 2);

    const hud = this.scene.get("Hud");
    hud.events.off("timeEnded", this.playerTimeDie, this);
    hud.events.off("hurryUp", this.hurryUp, this);
    hud.events.on("timeEnded", this.playerTimeDie, this);
    hud.events.on("hurryUp", this.hurryUp, this);

    this.isGameOver = false;
    this.cameras.main.setBackgroundColor("#000000");

    const sky: Phaser.GameObjects.TileSprite = this.add
      .tileSprite(640, 250, 1280, 600, "sky")
      .setScale(1)
      .setScrollFactor(0)
      .setOrigin(0.5);

    this.bg = this.add
      .tileSprite(640, 400, 1280, 720, "mountains-2")
      .setScale(1)
      .setScrollFactor(0)
      .setOrigin(0.5);

    this.bg2 = this.add
      .tileSprite(640, 450, 1280, 720, "mountains-2")
      .setScale(1)
      .setScrollFactor(0)
      .setOrigin(0.5);

    this.bg2.tilePositionX = 640;

    this.bg3 = this.add
      .tileSprite(640, 405, 1280, 720, "trees")
      .setScale(1)
      .setScrollFactor(0)
      .setOrigin(0.5);

    //@ts-ignore
    this.bg4 = this.add
      .shader("Ripple", 640, 900, 1280, 720, ["water"])
      .setScrollFactor(0);

    //this.registry.values.time = this.level.time;
    this.setUpLevel();

    //this.events.emit("startTimer");

    this.cameras.main.fadeIn();

    this.mist1 = this.add
      .tileSprite(640, 780, 1280, 88, "mist1")
      .setScale(2)
      .setScrollFactor(0)
      .setAlpha(0.4)
      .setOrigin(0.5, 1);

    this.mist2 = this.add
      .tileSprite(300, 780, 1280, 83, "mist2")
      .setScale(2.5)
      .setScrollFactor(0)
      .setAlpha(0.4)
      .setOrigin(0.5, 1);

    this.mist3 = this.add
      .tileSprite(300, 780, 1280, 59, "mist3")
      .setScale(3)
      .setScrollFactor(0)
      .setAlpha(0.4)
      .setOrigin(0.5, 1);

    this.tweens.add({
      targets: this.mist1,
      y: this.mist2.y + 30,
      alpha: 0.9,
      duration: 10000,
      loop: -1,
      yoyo: true,
      ease: "Sine.easeInOut"
    });

    this.tweens.add({
      targets: this.mist2,
      y: this.mist2.y + 20,
      alpha: 0.9,
      duration: 12000,
      loop: -1,
      yoyo: true,
      ease: "Sine.easeInOut"
    });

    this.tweens.add({
      targets: this.mist3,
      y: this.mist3.y + 30,
      alpha: 0.9,
      duration: 15000,
      loop: -1,
      yoyo: true,
      ease: "Sine.easeInOut"
    });

    this.blackTop = this.add
      .image(0, -150, "black-bar")
      .setOrigin(0)
      .setScrollFactor(0);

    this.blackBottom = this.add
      .image(0, 720, "black-bar")
      .setOrigin(0)
      .setScrollFactor(0);

    this.ouas = this.add
      .image(-200, -20, "ouas")
      .setOrigin(0)
      .setScrollFactor(0)
      .setAlpha(0);

    this.tweens.add({
      targets: this.ouas,
      alpha: 0,
      ease: "Sine.sineOut",
      x: -10,
      duration: 600
    });

    this.startText = this.add
      .bitmapText(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 - 10,
        "commodore",
        `Click/Tap to Play`,
        20
      )
      .setOrigin(0.5)
      .setAlpha(0)
      .setScrollFactor(0);

    this.hand = this.add
      .image(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 - 10,
        "hand"
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setScale(2)
      .setAlpha(0);

    this.input.once(
      "pointerdown",
      () => {
        this.player.setMovable();
        this.startTextTween.pause();

        this.tweens.add({
          targets: this.hand,
          yoyo: true,
          alpha: 1,
          x: this.hand.x + 100,
          repeat: 1
        });

        this.tweens.add({
          targets: [this.startText, this.ouas],
          alpha: 0,
          ease: "Sine.sineOut",
          yoyo: false,
          repeat: 0,

          duration: 600
        });
      },
      this
    );

    this.startTextTween = this.tweens.add({
      targets: this.startText,
      alpha: 1,
      ease: "Sine.sineOut",
      yoyo: true,
      repeat: -1,

      duration: 600
    });

    /* this.music = this.sound.add("intro");
    this.music.play(undefined, {
      loop: true
    });
    */
  }

  update(time: number, delta: number): void {
    if (!this.isGameOver) {
      if (this.player != null) {
        this.player.update(time, delta);

        this.bg.tilePositionX = this.cameras.main.scrollX * 0.05;
        this.bg2.tilePositionX = (this.cameras.main.scrollX + 640) * 0.1;
        this.bg3.tilePositionX = this.cameras.main.scrollX * 0.3;

        this.mist1.tilePositionX = this.mist1.tilePositionX + 0.15;
        this.mist2.tilePositionX = this.mist2.tilePositionX + 0.2;
        this.mist3.tilePositionX = this.mist3.tilePositionX + 0.3;

        /*console.log(this.player.body.velocity.y);
        if (this.player.body.velocity.y != 0 && this.player.isJump()) {
          this.bg3.tilePositionY += this.player.body.velocity.y * 0.01;
          this.bg4.y += this.player.body.velocity.y * -0.01;
        }*/
      }
    }
  }

  setUpLevel(): void {
    this.map = this.make.tilemap({
      key: this.level.map
    });

    this.tileset = this.map.addTilesetImage("tilemap", "tiles");
    // console.log(this.tileset);

    this.layer = this.map.createStaticLayer("world", this.tileset, 0, 0);

    this.layer3 = this.map.createStaticLayer("over", this.tileset, 0, 0);
    this.layer2 = this.map.createDynamicLayer("collision", this.tileset, 0, 0);

    this.layer2.setCollisionByProperty({
      collide: true
    });
    this.layer3.setDepth(10);

    //@ts-ignore
    this.animatedTiles.init(this.map);

    this.map.forEachTile((tile: Phaser.Tilemaps.Tile) => {
      if (tile.properties.customCollide != undefined) {
        tile.setCollision(false, false, true, false, true);
      }
    }, this);

    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels * this.mapScaleFactor,
      this.map.heightInPixels * this.mapScaleFactor
    );
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels * this.mapScaleFactor,
      this.map.heightInPixels * this.mapScaleFactor
    );

    //@ts-ignore
    this.blockEmitter = this.add.particles("brick");

    //@ts-ignore
    this.blockEmitter.createEmitter({
      gravityY: 1600,
      lifespan: 2000,
      speed: 400,
      scale: 3,
      angle: {
        min: -90 - 25,
        max: -45 - 25
      },
      frequency: -1
    });

    this.registry.values.time = this.level.time;

    /*
    this.brickTile = new BrickTile({
      scene: this
    });
    */

    this.setUpPlayer();
    this.setUpTriggers();
    this.setUpDoors();
    this.setUpPlatforms();
    this.setUpItems();

    this.searching = new Searching({ scene: this, x: 0, y: 0, key: "lift" });
    //this.setUpEnemies();

    this.player.setPlayerImmovable();
  }

  setUpPlayer(): void {
    //setup player

    const playerObject = this.map.getObjectLayer("player").objects as any[];
    const playerName = this.registry.get("player");

    playerObject.forEach((player: playerMap) => {
      switch (player.name) {
        case "player":
          this.player = new Player({
            key: `player`,
            x: player.x * this.mapScaleFactor,
            y: player.y * this.mapScaleFactor,
            name: playerName,
            scene: this,
            physic: true,
            commands: true,
            inGame: true
          }).setScale(1);

          this.cameras.main.startFollow(
            this.player,
            false,
            0.08,
            0.08,
            undefined,
            32 * 4
          );

          this.physics.add.collider(
            this.player,
            this.layer2,
            this.playerTilesCollide,
            undefined,
            this
          );

          break;
      }
    });
  }

  setUpDoors(): void {
    //setup doors and triggers
    //---------------------------------------------------------------------

    this.mapDoors = this.map.getObjectLayer("doors").objects as any[];
  }

  setUpTriggers(): void {
    //setup doors and triggers
    //---------------------------------------------------------------------
    this.groupTrigger = this.add.group({ runChildUpdate: true });
    this.mapTriggers = this.map.getObjectLayer("triggers").objects as any[];
    this.mapTriggers.forEach((tile: any) => {
      //console.log(tile.x / 32, tile.y / 32);

      if (tile.name == "trigger") {
        this.groupTrigger.add(
          new Trigger({
            scene: this,
            x: tile.x / 32,
            y: tile.y / 32,
            values: <TriggerValues>JSON.parse(tile.type)
          })
        );
      }
    });

    this.physics.add.overlap(
      this.player,
      this.groupTrigger,
      this.triggerCollide,
      undefined,
      this
    );
    //console.log(this.mapDoors);
  }

  triggerCollide(_obj1: any, _obj2: any): void {
    const _player: Player = <Player>_obj1;
    const _trigger: Trigger = <Trigger>_obj2;

    //console.log(_trigger);
  }

  setUpPlatforms(): void {
    //setup platforms
    //---------------------------------------------------------------------
    this.groupPlatform = this.add.group({ runChildUpdate: true });

    const platformsObject = this.map.getObjectLayer("platforms")
      .objects as any[];

    platformsObject.forEach((platform: platformMap) => {
      switch (platform.name) {
        case "platform":
          this.groupPlatform.add(
            new Platform({
              scene: this,
              x: platform.x * this.mapScaleFactor,
              y: platform.y * this.mapScaleFactor,
              key: `platform`,
              values: <PlatformValues>JSON.parse(platform.type)
            })
          );

          break;
        case "lift":
          this.groupPlatform.add(
            new Lift({
              scene: this,
              x: platform.x * this.mapScaleFactor,
              y: platform.y * this.mapScaleFactor,
              key: `lift`,
              values: <LiftValues>JSON.parse(platform.type)
            })
          );

          break;
      }
    });

    this.physics.add.collider(
      this.player,
      this.groupPlatform,
      this.platformCollide,
      undefined,
      this
    );
  }

  setUpEnemies(): void {
    this.groupEnemy = this.add.group({ runChildUpdate: true });
    const enemiesObject = this.map.getObjectLayer("enemies").objects as any[];

    enemiesObject.forEach((enemy: any) => {
      switch (enemy.name) {
        case "enemy1":
          this.groupEnemy.add(
            new EnemyGeneric({
              scene: this,
              key: "player",
              x: enemy.x,
              y: enemy.y,
              frame: null
            })
          );
          break;

        case "enemy2":
          break;
      }
    });

    this.physics.add.collider(this.groupEnemy, this.layer2);
    this.physics.add.collider(
      this.player,
      this.groupEnemy,
      this.enemyCollide,
      undefined,
      this
    );
  }

  setUpItems(): void {
    this.groupItems = this.add.group({ runChildUpdate: true });
    const itemsObject = this.map.getObjectLayer("items").objects as any[];

    itemsObject.forEach((item: any) => {
      switch (item.name) {
        case "item":
          //console.log(item);
          this.groupItems.add(
            new Item({
              scene: this,
              key: "items",
              x: item.x,
              y: item.y
            })
          );
          break;
      }
    });

    this.physics.add.overlap(
      this.player,
      this.groupItems,
      this.itemOverlap,
      undefined,
      this
    );
  }

  itemOverlap(_obj1: any, _obj2: any): void {
    const _player: Player = <Player>_obj1;
    const _item: Item = <Item>_obj2;

    //console.log(_player.body.blocked);

    if (
      //@ts-ignore
      _player.keys.get("UP").isDown &&
      //@ts-ignore
      !_player.keys.get("RIGHT").isDown &&
      //@ts-ignore
      !_player.keys.get("LEFT").isDown
    ) {
      _player.setSearch(true);
      _item.searching();
    } else {
      _player.setSearch(false);
      _item.stopSearching();
      //_player.play("player-idle", true);
    }
  }

  setUpBonus(): void {
    //setup bonuses
    //---------------------------------------------------------------------
    this.groupBonus = this.add.group();
    const bonusesObject = this.map.getObjectLayer("bonus").objects as any[];
    bonusesObject.forEach((bonus: bonusMap) => {
      let _bonus: Bonus;
      switch (bonus.name) {
        case "100":
        case "200":
        case "300":
        case "400":
        case "500":
          _bonus = new Bonus({
            scene: this,
            x: bonus.x * this.mapScaleFactor,
            y: bonus.y * this.mapScaleFactor,
            key: `bonus-coin`,
            frame: null,
            score: parseInt(bonus.name)
          });

          this.groupBonus.add(_bonus);
          break;

        case "1000":
          break;
      }
    });
    this.physics.add.collider(this.groupBonus, this.layer);
    this.physics.add.overlap(
      this.player,
      this.groupBonus,
      this.bonusCollide,
      undefined,
      this
    );
  }

  restartLevel() {
    //console.log('restart level')
    this.registry.set("time", this.level.time);
    this.layer.destroy();
    this.map.destroy();
    this.groupEnemy.clear(true, true);
    this.groupBonus.clear(true, true);
    this.groupPlatform.clear(true, true);
    this.setUpLevel();
    this.delucaHits = 0;
    this.events.emit("restartTimer");
  }

  gameOver() {
    this.music.stop();
    this.player.die();
    let sound: Phaser.Types.Sound.AudioSpriteSound = this.sound.addAudioSprite(
      "sfx"
    );
    //@ts-ignore
    sound.on("complete", (sound: AudioSpriteSound) => {
      //@ts-ignore
      this.music.seek = 0;
      this.music.resume();
      //@ts-ignore
      sound.destroy();
      this.isGameOver = true;
      this.player.gameOver();
      this.groupEnemy.clear(true, true);

      this.scene.stop("GamePlay");
      this.scene.stop("Hud");

      this.scene.start("GameOver");
      this.scene.bringToTop("GameOver");
    });
    //@ts-ignore
    sound.play("smb_mariodie");
  }

  playerTilesCollide(_obj1: any, _obj2: any): void {
    const _player: Player = <Player>_obj1;
    const _tile: Phaser.Tilemaps.Tile = <Phaser.Tilemaps.Tile>_obj2;

    //@ts-ignore
    if (_tile.properties.callback) {
      //@ts-ignore
      switch (_tile.properties.callback) {
        case "breakable":
          //@ts-ignore
          if (_player.body.blocked.up) {
            if (_tile.properties.bonus == 0) {
              //console.log('crash')
              this.map.removeTileAt(_tile.x, _tile.y, true, true, this.layer);
              this.sound.playAudioSprite("sfx", "smb_breakblock");
              this.blockEmitter.emitParticle(
                6,
                _tile.x * 16 * this.mapScaleFactor + 35,
                _tile.y * 16 * this.mapScaleFactor + 35
              );
            } else {
              _tile.properties.bonus -= 1;
              //@ts-ignore

              this.brickTile.restart(_tile, "BrickTile");
              this.sound.playAudioSprite("sfx", "smb_bump");
            }
          }

          break;

        case "bonusable":
          //@ts-ignore
          if (_player.body.blocked.up) {
            if (_tile.properties.bonus == 0) {
              this.groupBonus.add(
                new Bonus1Up({
                  scene: this,
                  x: _tile.x * 16 * this.mapScaleFactor + 16,
                  y: _tile.y * 16 * this.mapScaleFactor - 48,
                  key: `1up`,
                  frame: null,
                  score: 0
                })
              );

              this.map.removeTileAt(_tile.x, _tile.y, true, true, this.layer);
              this.sound.playAudioSprite("sfx", "smb_breakblock");
              this.blockEmitter.emitParticle(
                6,
                _tile.x * 16 * this.mapScaleFactor + 35,
                _tile.y * 16 * this.mapScaleFactor + 35
              );
            } else {
              _tile.properties.bonus -= 1;
              //@ts-ignore

              this.brickTile.restart(_tile, "BrickTile");
              this.sound.playAudioSprite("sfx", "smb_bump");
            }
          }
          break;

        case "killPlayer":
          //@ts-ignore

          this.decLives();

          break;

        case "exit":
          this.sound.stopAll();
          this.registry.values.level++;
          this.scene.pause("GamePlay");
          this.scene.pause("Hud");
          this.scene.start("Level");
          this.scene.bringToTop("Level");

          break;

        case "win":
          this.sound.stopAll();
          this.scene.stop("GamePlay");
          this.scene.stop("Hud");
          this.scene.start("Win");
          this.scene.bringToTop("Win");

          break;
      }
    }
  }

  bonusCollide(_obj1: any, _obj2: any): void {
    const _player: Player = <Player>_obj1;
    const _bonus: Bonus = <Bonus>_obj2;

    _bonus.getBonus();
  }

  win(): void {}

  platformCollide(_obj1: any, _obj2: any): void {
    const _player: Player = <Player>_obj1;
    const _platform: Platform | Lift = <Platform | Lift>_obj2;

    //console.log(_player.body.blocked);
    //@ts-ignore
    if (_player.body.touching.down && _platform.body.touching.up) {
      _player.isTouchingPlatform(_platform);
    }
  }

  enemyCollide(_obj1: any, _obj2: any): void {
    /*
    const _player: Player = <Player>_obj1;
    const _enemy: Major = <Major>_obj2;

    if (
      !_player.isDied() &&
      //@ts-ignore
      (_player.body.touching.left ||
        _player.body.touching.right ||
        _player.body.touching.up) &&
      //@ts-ignore
      (_enemy.body.touching.left ||
        //@ts-ignore
        _enemy.body.touching.right ||
        //@ts-ignore
        _enemy.body.touching.down)
    ) {
      this.decLives();
      // console.log('dead')
    }

    if (
      !_player.isDied() &&
      _player.body != undefined &&
      //@ts-ignore
      _player.body.touching.down &&
      //@ts-ignore
      _enemy != null &&
      //@ts-ignore
      _enemy.body.touching.up
    ) {
      _player.jumpOverEnemy();
      this.sound.playAudioSprite("sfx", "smb_stomp");
      _enemy.gotHitOnHead();
    }

    */
  }

  playerTimeDie(): void {
    this.decLives();
  }

  decLives() {
    this.registry.values.lives -= 1;
    this.events.emit("livesChanged");
    if (this.registry.get("lives") > 0) {
      this.playerDie();
    } else {
      this.gameOver();
    }
  }

  hurryUp(): void {
    this.music.pause();
    let sound: Phaser.Types.Sound.AudioSpriteSound = this.sound.addAudioSprite(
      "sfx"
    );
    //@ts-ignore
    sound.on("complete", (sound: Phaser.Types.Sound.AudioSpriteSound) => {
      this.music.resume();
      //@ts-ignore
      sound.destroy();
    });
    //@ts-ignore
    sound.play("smb_warning");
  }

  getPlayerX(): number {
    return this.player.x;
  }
  getPlayerY(): number {
    return this.player.y;
  }

  playerDie(): void {
    this.player.die();
    this.music.pause();

    let sound: Phaser.Types.Sound.AudioSpriteSound = this.sound.addAudioSprite(
      "sfx"
    );
    //@ts-ignore
    sound.on("complete", (sound: Phaser.Types.Sound.AudioSpriteSound) => {
      //@ts-ignore
      this.music.seek = 0;
      this.music.resume();
      //@ts-ignore
      sound.destroy();

      this.restartLevel();
    });
    //@ts-ignore
    sound.play("smb_mariodie");
  }
}
