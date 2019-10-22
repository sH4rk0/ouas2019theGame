/**
 * @author       Francesco Raimondo <francesco.raimondo@gmail.com>
 * @copyright    2019 zero89
 * @description  Run4Mayor
 * @license      zero89
 */

import { GameData } from "../GameData";
import { modalPrompt } from "../InitGame";
import { swEnabled } from "../InitGame";

export default class Preloader extends Phaser.Scene {
  body: HTMLElement;
  loading: Phaser.GameObjects.Text;
  text: Phaser.GameObjects.Text;
  progress: Phaser.GameObjects.Graphics;
  logo: Phaser.GameObjects.Image;
  ouas: Phaser.GameObjects.Image;
  constructor() {
    super({
      key: "Preloader"
    });
  }

  preload() {
    //console.log('Preloader:preload')
    this.progress = this.add.graphics();
    this.loadAssets();
  }

  init() {
    this.body = document.getElementsByTagName("body")[0];
    this.logo = this.add
      .image(this.game.canvas.width / 2, this.game.canvas.height / 2, "intro")
      .setScale(4);

    this.ouas = this.add
      .image(-30, -40, "ouas")
      .setOrigin(0)
      .setScale(1)
      .setAlpha(0);

    const _config = {
      font: "35px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
      wordWrap: true,
      wordWrapWidth: 1000
    };
    this.text = this.add
      .text(-50, 300, "Escape from\nSinclair's castle", _config)
      .setStroke("#000000", 10)
      .setAlpha(0)
      .setOrigin(0)
      .setFontFamily('"Press Start 2P"')
      .setDepth(1001);

    this.loading = this.add
      .text(
        this.game.canvas.width / 2,
        620,
        "Escape from\nSinclair's castle",
        _config
      )
      .setStroke("#000000", 10)
      .setAlpha(1)
      .setOrigin(0)
      .setFontFamily('"Press Start 2P"')
      .setDepth(1001)
      .setOrigin(0.5);

    /* this.add
      .text(this.game.canvas.width / 2, 620, "commodore", "Loading...")
      .setOrigin(0.5);*/
  }

  create() {
    //this.scene.start('Menu')
  }

  loadAssets(): void {
    this.body.className = "loading";

    this.load.on("start", () => {
      //progress.destroy();
      //console.log('load start')
    });

    this.load.on("fileprogress", (file: any, value: any) => {
      //console.log(file, value)
    });

    this.load.on("progress", (value: any) => {
      this.progress.clear();
      this.progress.fillStyle(0xffffff, 1);
      this.progress.fillRect(0, 680, 1280 * value, 40);

      //this.logo.setAlpha(value);

      this.loading.setText("Loading..." + Math.round(value * 100) + "%");

      this.logo.setAlpha(value);
    });

    this.load.on("complete", () => {
      this.tweens.add({
        targets: [this.ouas],
        alpha: 1,
        duration: 250
      });
      this.tweens.add({
        targets: [this.text],
        alpha: 1,
        x: 20,
        duration: 250,
        ease: "Sine.easeOut",
        delay: 200
      });
      this.loading.setText("Tap/click to continue");
      this.body.className = "";
      this.progress.clear();
      if (this.sys.game.device.input.touch) {
        //@ts-ignore
        //console.log("swEnabled", swEnabled);
        //@ts-ignore
        if (swEnabled && modalPrompt != null) {
          console.log("show modal");
          modalPrompt.classList.add("show");
        }
      }

      this.input.once("pointerdown", () => {
        this.scene.stop("Preloader");
        this.registry.set("time", 20);
        this.registry.set("lives", 3);
        this.registry.set("player", "");
        this.scene.start("GamePlay");
        this.scene.start("Hud");
        this.scene.bringToTop("GamePlay");
        this.scene.bringToTop("Hud");

        if (this.sys.game.device.input.touch) {
          this.scene.start("Joy");
          this.scene.bringToTop("Joy");
        }
      });

      //console.log('load assetts complete')
    });

    //Assets Load
    //--------------------------

    //SCRIPT
    GameData.script.forEach((element: ScriptAsset) => {
      this.load.script(element.key, element.path);
      //@ts-ignore
    });

    // IMAGES
    GameData.images.forEach((element: ImageAsset) => {
      this.load.image(element.name, element.path);
    });

    // TILEMAPS
    GameData.tilemaps.forEach((element: TileMapsAsset) => {
      this.load.tilemapTiledJSON(element.key, element.path);
    });

    // SPRITESHEETS
    GameData.spritesheets.forEach((element: SpritesheetsAsset) => {
      this.load.spritesheet(element.name, element.path, {
        frameWidth: element.width,
        frameHeight: element.height,
        endFrame: element.frames
      });
    });

    //bitmap fonts
    GameData.bitmapfont.forEach((element: BitmapfontAsset) => {
      this.load.bitmapFont(element.name, element.imgpath, element.xmlpath);
    });

    // SOUNDS
    GameData.sounds.forEach((element: SoundAsset) => {
      this.load.audio(element.name, element.paths);
    });

    // Audio
    GameData.audio.forEach((element: AudioSpriteAsset) => {
      this.load.audioSprite(
        element.name,
        element.jsonpath,
        element.paths,
        element.instance
      );
    });
  }
}
