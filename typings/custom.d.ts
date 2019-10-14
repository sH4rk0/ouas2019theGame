interface TilesConfig {
  type: string;
  texture: string;
  x: number;
  y: number;
}

interface MapSize {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface PlayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  name: string;
  physic: boolean;
  commands: boolean;
  inGame: boolean;
}
interface ScoreConfig {
  name: string;
  score: number;
  level: number;
  levelName: string;
}

interface PlatformConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  values: PlatformValues;
}

interface PlatformValues {
  rangeX?: number;
  rangeY?: number;
  direction?: number;
  duration?: number;
  triggered?: boolean;
  velocity?: number;
  steps?: Array<{ r: number; v: number }>;
}

interface LiftConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  name: string;
  values: LiftValues;
}
interface LiftValues {
  start?: number;
  key?: string;
  steps?: Array<{ r: number; v: number }>;
}

interface TriggerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  values: TriggerValues;
}

interface TriggerValues {
  type: string;
  width: number;
  height: number;
  status: string;
  timeline?: Array<TriggerTimeline>;
  timelineOn?: Array<TriggerTimeline>;
  timelineOff?: Array<TriggerTimeline>;
}

interface TriggerTimeline {
  type: string;
  target: string;
  width?: number;
  height?: number;
  delay?: number;
  status?: string;
  value?: number;
  from?: number;
  to?: number;
  duration?: number;
  key?: string;
  volume?: number;
  loop?: boolean;
  anim?: string;
}

interface TileAnimation {
  animOn: Array<{ tileId: number; delay: number; i: number }>;
  animOff: Array<{ tileId: number; delay: number; i: number }>;
}

interface LevelConfig {
  name: string;
  block: {
    key: string;
    x: number;
    y: number;
    scale: number;
    offsetX: number;
    offsetY: number;
  };
  map: string;
  time: number;
  bg: { x: number; y: number };
  clouds: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    key: string;
    speed: number;
  }>;
}

interface EnemyConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  frame: string | null;
}

interface BonusConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  frame: string | null;
  score: number;
  allowGravity?: boolean | undefined;
}

interface ItemConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  options: any;
}

interface Respawn {
  x: number;
  y: number;
  key: string;
}

interface SearchingConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
}

interface BombConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  hit: number;
}
interface ExplosionConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
}

interface genericConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
}

interface enemyMap {
  name: string;
  x: number;
  y: number;
}

interface platformMap {
  name: string;
  x: number;
  y: number;
  type: string;
}

interface bonusMap {
  name: string;
  x: number;
  y: number;
  score: number;
}

interface playerMap {
  name: string;
  x: number;
  y: number;
}

interface ImageAsset {
  name: string;
  path: string;
}

interface ScriptAsset {
  key: string;
  path: string;
}

interface TileMapsAsset {
  key: string;
  path: string;
}

interface SpritesheetsAsset {
  name: string;
  path: string;
  width: number;
  height: number;
  frames: number;
  spacing?: number;
}

interface SoundAsset {
  name: string;
  paths: Array<string>;
}

interface AudioSpriteAsset {
  name: string;
  jsonpath: string;
  paths: Array<string>;
  instance: { instance: number };
}

interface BitmapfontAsset {
  name: string;
  imgpath: string;
  xmlpath: string;
}
