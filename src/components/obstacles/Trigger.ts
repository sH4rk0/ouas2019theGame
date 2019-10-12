import GamePlay from "../../scenes/GamePlay";
import { TileAnimator } from "./TileAnimator";

export class Trigger extends Phaser.GameObjects.Image {
  // variables
  protected currentScene: GamePlay;
  private triggered: boolean = false;
  private triggeredOnce: boolean = false;
  private triggeredSwitch: boolean = false;
  private values: TriggerValues;
  private timeline: Array<TriggerTimeline>;
  private status: string;

  constructor(params: TriggerConfig) {
    super(params.scene, params.x, params.y, "");

    // console.log("new trigger");
    // variables
    this.currentScene = <GamePlay>params.scene;
    this.values = params.values;
    this.timeline = [];
    //console.log(this.values);

    this.x = params.x * 32;
    this.y = params.y * 32;
    this.width = 32 * this.values.width;
    this.height = 32 * this.values.height;
    this.status = this.values.status;

    if (this.values.type == "switch") {
      if (this.values.status == "on") {
      } else if (this.values.status == "off") {
      }
    }

    this.currentScene.physics.world.enable(this);
    //@ts-ignore
    this.body
      //@ts-ignore
      .setImmovable(true)
      .setAllowGravity(false);
    //.setSize(32 * this.values.width, 32 * this.values.height);
    //@ts-ignore

    this.setOrigin(0, 1).setAlpha(0);

    this.currentScene.add.existing(this);
  }

  update(): void {
    if (this.values.type === "once" && !this.triggeredOnce) {
      //@ts-ignore
      if (!this.body.touching.none) {
        this.triggeredOnce = true;
        if (this.values.timeline != undefined)
          this.timeline = this.values.timeline;

        this.executeTrigger();
      }
    } else if (this.values.type === "switch") {
      //console.log(this.triggeredSwitch, this.status);

      //@ts-ignore
      if (!this.body.touching.none) {
        if (this.triggeredSwitch) return;

        if (this.status == "off") {
          if (this.values.timelineOn != undefined)
            this.timeline = this.values.timelineOn;
          this.status = "on";
        } else if (this.status == "on") {
          if (this.values.timelineOff != undefined)
            this.timeline = this.values.timelineOff;
          this.status = "off";
        }
        this.triggeredSwitch = true;
        this.executeTrigger();
      } else {
        this.triggeredSwitch = false;
      }
    }
  }

  executeTrigger(): void {
    this.timeline.forEach((timelineElement: TriggerTimeline) => {
      this.currentScene.triggerExecuter.execute(timelineElement);
    });
  }
}
