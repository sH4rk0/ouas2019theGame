/**
 * @author       Francesco Raimondo <francesco.raimondo@gmail.com>
 * @copyright    2019 zero89
 * @description  Run4Mayor
 * @license      zero89
 */

import { Player } from "../components/Player";

//import {AnimatedTiles} from '../../node_modules/phaser-animated-tiles/dist/AnimatedTiles.min.js'

export default class Menu extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  public layer: Phaser.Tilemaps.DynamicTilemapLayer;
  public currentPlayer: Player | null;
  private titleCollider: Phaser.Physics.Arcade.Collider;
  private lands: Phaser.GameObjects.TileSprite;
  private cloud1: Phaser.GameObjects.TileSprite;
  private cloud2: Phaser.GameObjects.TileSprite;
  private light: Phaser.GameObjects.Image;
  private light2: Phaser.GameObjects.Image;
  private text: Phaser.GameObjects.BitmapText;
  private music: Phaser.Sound.BaseSound;
  private GroupTitle: Phaser.GameObjects.Group;

  private theItalian: Phaser.GameObjects.Text;

  private started: boolean;

  constructor() {
    super({
      key: "Menu"
    });
  }

  create() {
    this.started = false;
    this.input.addPointer(2);

    if (this.currentPlayer != null) {
      this.currentPlayer.destroy();
      this.currentPlayer = null;
    }

    const sky: Phaser.GameObjects.TileSprite = this.add
      .tileSprite(640, 640, 1280, 720, "sky")
      .setScale(1)
      .setScrollFactor(0);

    this.cloud1 = this.add
      .tileSprite(640, 250, 1280, 300, "cloud1")
      .setScale(1)
      .setScrollFactor(0);

    this.cloud2 = this.add
      .tileSprite(640, 150, 1280, 300, "cloud2")
      .setScale(1)
      .setScrollFactor(0);

    this.lands = this.add
      .tileSprite(0, 220, 1280, 316, "4lands")
      .setOrigin(0)
      .setScrollFactor(0);

    this.light = this.add
      .image(this.game.canvas.width / 2, 200, "light")
      .setOrigin(0.5, 0.5)
      .setScale(0.8);

    this.light2 = this.add
      .image(this.game.canvas.width / 2, 200, "light")
      .setOrigin(0.5, 0.5)
      .setScale(0.8);

    this.GroupTitle = this.add.group();

    this.cameras.main.setBackgroundColor("#69d3f9");
    this.cameras.main.fadeIn();

    this.map = this.make.tilemap({ key: "intro-test" });

    this.tileset = this.map.addTilesetImage("tilemap", "tiles");

    this.layer = this.map.createDynamicLayer("world", this.tileset, 0, 0);

    console.log(this.map, this.tileset, this.layer);
    this.physics.world.bounds.width = this.layer.width;
    this.layer.setCollisionByProperty({ collide: true });

    let loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.add("transparent");
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          // @ts-ignore
          loadingScreen.remove();
        }
      });
    }

    this.initGlobalDataManager();

    this.currentPlayer = new Player({
      key: "player-salvini",
      x: 640,
      y: 400,
      name: "salvini",
      scene: this,
      physic: true,
      commands: false,
      inGame: false
    }).setScale(2);
    this.currentPlayer.play("player-salvini-idle");

    this.currentPlayer.setCommands(true);
    this.currentPlayer.setMovable();
    this.currentPlayer.setTint(0xffffff);

    this.physics.add.collider(this.currentPlayer, this.layer);

    this.physics.add.collider(
      this.currentPlayer,
      this.GroupTitle,
      this.playerTitleCollide,
      undefined,
      this
    );

    this.text = this.add
      .bitmapText(
        this.game.canvas.width / 2,
        650,
        "commodore",
        "Last score: 49 MLN Points",
        40
      )
      .setOrigin(0.5);

    this.music = this.sound.add("intro");
    this.music.play(undefined, {
      loop: true
    });

    //@ts-ignore
    WebFont.load({
      google: {
        families: ["Press Start 2P"]
      },
      active: () => {
        const _config = {
          font: "45px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          wordWrap: true,
          wordWrapWidth: 1000
        };

        this.theItalian = this.add
          .text(1280 / 2, 0, "THE ITALIAN", _config)
          .setStroke("#000000", 10)
          .setAlpha(0)
          .setOrigin(0.5)
          .setFontFamily('"Press Start 2P"');

        this.tweens.add({
          targets: this.theItalian,
          alpha: 1,
          y: 60,
          ease: "Power1",
          delay: 500,
          duration: 500
        });
      }
    });
  }

  playerTitleCollide(_obj1: any, _obj2: any): void {}

  start() {
    //console.log('start')
    if (this.currentPlayer == null) return;
    this.sound.playAudioSprite("sfx", "smb_coin");
    this.currentPlayer.setImmovable();

    this.cameras.main.fadeOut(
      300,
      255,
      255,
      255,

      () => {
        this.time.addEvent({
          delay: 300,
          callback: () => {
            this.scene.start("Level");
            this.scene.stop("Menu");
            this.scene.bringToTop("Level");
            this.music.stop();
          }
        });
      },
      this
    );
  }

  update(time: number, delta: number) {
    if (this.currentPlayer != null) this.currentPlayer.update(time, delta);

    this.light.setAngle((this.light.angle += 0.5));
    this.light2.setAngle((this.light2.angle += 0.25));
    this.cloud1.tilePositionX += 0.7;
    this.cloud2.tilePositionX += 0.5;
  }

  private initGlobalDataManager(): void {
    this.registry.set("time", 0);
    this.registry.set("level", 1);
    this.registry.set("score", 0);
    this.registry.set("lives", 3);
    this.registry.set("player", "");
  }
}
