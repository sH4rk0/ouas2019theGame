export let GameAnim: any = {
  doorAnim3: {
    animOn: [
      { tileId: 31, delay: 50, i: 1 },
      { tileId: 31, delay: 50, i: 2 },
      { tileId: 31, delay: 50, i: 3 }
    ],
    animOff: [
      { tileId: 31, delay: 50, i: 3 },
      { tileId: 31, delay: 50, i: 2 },
      { tileId: 31, delay: 50, i: 1 }
    ]
  },
  doorAnim4: {
    animOn: [
      { tileId: 31, delay: 50, i: 1 },
      { tileId: 31, delay: 50, i: 2 },
      { tileId: 31, delay: 50, i: 3 },
      { tileId: 31, delay: 50, i: 4 }
    ],
    animOff: [
      { tileId: 31, delay: 50, i: 4 },
      { tileId: 31, delay: 50, i: 3 },
      { tileId: 31, delay: 50, i: 2 },
      { tileId: 31, delay: 50, i: 1 }
    ]
  },
  doorAnim5: {
    animOn: [
      { tileId: 31, delay: 50, i: 1 },
      { tileId: 31, delay: 50, i: 2 },
      { tileId: 31, delay: 50, i: 3 },
      { tileId: 31, delay: 50, i: 4 },
      { tileId: 31, delay: 50, i: 5 }
    ],
    animOff: [
      { tileId: 31, delay: 50, i: 5 },
      { tileId: 31, delay: 50, i: 4 },
      { tileId: 31, delay: 50, i: 3 },
      { tileId: 31, delay: 50, i: 2 },
      { tileId: 31, delay: 50, i: 1 }
    ]
  }
};

export let GameData: any = {
  levels: [
    {
      name: "Acquamela",
      block: {
        key: "block-acquamela",
        x: 100,
        y: 370,
        scale: 4,
        offsetX: 0,
        offsetY: -55
      },
      map: "level-1",
      intro: "Kill you opponents, collect bonus and find the exit",
      time: 100,
      bg: { x: 0, y: -320 },
      clouds: [
        {
          x: 640,
          y: 250,
          w: 1280,
          h: 300,
          key: "cloud1",
          speed: 0.5
        },
        {
          x: 640,
          y: 150,
          w: 1280,
          h: 300,
          key: "cloud2",
          speed: 0.7
        }
      ]
    }
  ],
  tilemaps: [
    {
      key: "level-1",
      path: "assets/images/tilemap/level-1.json"
    }
  ],
  spritesheets: [
    {
      name: "tiles",
      path: "assets/images/tilemap/tilemap.png",
      width: 46,
      height: 46,
      spacing: 2
    },
    {
      name: "player",
      path: "assets/images/game/players/player.png",
      width: 60,
      height: 70,
      frames: 40
    },
    {
      name: "items",
      path: "assets/images/game/items/items.png",
      width: 64,
      height: 128,
      frames: 2
    }
  ],

  images: [
    {
      name: "btn-blue",
      path: "assets/images/game/buttons/btn-blue.png"
    },
    {
      name: "hand",
      path: "assets/images/game/hand.png"
    },
    {
      name: "heart",
      path: "assets/images/game/heart.png"
    },
    {
      name: "btn-green",
      path: "assets/images/game/buttons/btn-green.png"
    },
    {
      name: "btn-purple",
      path: "assets/images/game/buttons/btn-purple.png"
    },
    {
      name: "btn-red",
      path: "assets/images/game/buttons/btn-red.png"
    },
    {
      name: "platform",
      path: "assets/images/game/platform.png"
    },
    {
      name: "brick",
      path: "assets/images/game/brick.png"
    },
    {
      name: "BrickTile",
      path: "assets/images/game/BrickTile.png"
    },

    {
      name: "cloud1",
      path: "assets/images/game/cloud1.png"
    },
    {
      name: "time",
      path: "assets/images/game/time.png"
    },
    {
      name: "cloud2",
      path: "assets/images/game/cloud2.png"
    },
    {
      name: "light",
      path: "assets/images/game/light.png"
    },
    {
      name: "sky",
      path: "assets/images/game/sky.png"
    },
    {
      name: "mountains",
      path: "assets/images/game/mountains.png"
    },
    {
      name: "mountains-2",
      path: "assets/images/game/mountains-2.png"
    },
    {
      name: "trees",
      path: "assets/images/game/trees.png"
    },
    {
      name: "water",
      path: "assets/images/game/water.png"
    },
    {
      name: "trees",
      path: "assets/images/game/trees.png"
    },

    {
      name: "land",
      path: "assets/images/game/land.png"
    },

    {
      name: "mist1",
      path: "assets/images/game/mist1.png"
    },
    {
      name: "mist2",
      path: "assets/images/game/mist2.png"
    },
    {
      name: "mist3",
      path: "assets/images/game/mist3.png"
    },
    {
      name: "thelucasart",
      path: "assets/images/game/thelucasart.png"
    },
    {
      name: "lift",
      path: "assets/images/game/lift.png"
    }
  ],

  sounds: [
    {
      name: "breeze",
      paths: ["assets/sounds/breeze.ogg", "assets/sounds/breeze.m4a"],
      volume: 1,
      loop: false
    },
    {
      name: "intro",
      paths: ["assets/sounds/intro.ogg", "assets/sounds/intro.m4a"],
      volume: 1,
      loop: false
    },
    {
      name: "anothervisitor",
      paths: [
        "assets/sounds/another-visitor-original.ogg",
        "assets/sounds/another-visitor-original.m4a"
      ],
      volume: 1,
      loop: false
    },
    {
      name: "gameover",
      paths: ["assets/sounds/gameover.ogg", "assets/sounds/gameover.m4a"],
      volume: 1,
      loop: false
    },
    {
      name: "ahhhhh",
      paths: ["assets/sounds/ahhhhh.ogg", "assets/sounds/ahhhhh.m4a"],
      volume: 1,
      loop: false
    },
    {
      name: "loop",
      paths: ["assets/sounds/loop.ogg", "assets/sounds/loop.m4a"],
      volume: 0.5,
      loop: true
    },
    {
      name: "close-door",
      paths: ["assets/sounds/close-door.ogg", "assets/sounds/close-door.m4a"],
      volume: 1,
      loop: true
    }
  ],

  audio: [
    {
      name: "sfx",
      jsonpath: "assets/sounds/sfx.json",
      paths: ["assets/sounds/sfx.ogg", "assets/sounds/sfx.mp3"],
      instances: 4
    }
  ],

  script: [
    {
      key: "webfont",
      path: "assets/js/webfonts.js"
    }
  ],

  bitmapfont: [
    {
      name: "carrier",
      imgpath: "assets/fonts/carrier_command.png",
      xmlpath: "assets/fonts/carrier_command.xml"
    }
  ],
  triggers: {
    //enter door
    t_0: {
      type: "once",
      width: 2,
      height: 6,
      timeline: [
        { type: "camera-shake", value: 1, delay: 250 },
        { type: "door", target: "d_0", status: "on", delay: 0 },
        {
          type: "play-audio",
          delay: 200,
          key: "close-door",
          volume: 0.5
        },
        { type: "camera-zoom-in", delay: 600, duration: 1000 },
        {
          type: "play-audio",
          delay: 2000,
          key: "anothervisitor",
          loop: false,
          volume: 0.5
        },

        {
          type: "play-music",
          delay: 9000
        },
        {
          type: "start-timer",
          delay: 9000
        },
        { type: "camera-zoom-out", delay: 9000 },
        { type: "respawn", respawn: 1 },
        {
          type: "trigger-copy",
          from: "t_0_short",
          to: "t_0",
          delay: 100
        }
      ]
    },

    t_0_short: {
      type: "once",
      width: 2,
      height: 6,
      timeline: [
        { type: "camera-shake", value: 1, delay: 250 },
        { type: "door", target: "d_0", status: "on", delay: 0 },
        {
          type: "play-audio",
          delay: 200,
          key: "close-door",
          volume: 0.5
        },

        {
          type: "play-music",
          delay: 500
        },
        {
          type: "start-timer",
          delay: 500
        },

        { type: "respawn", respawn: 1 }
      ]
    },

    //test
    t_1000: {
      type: "switch",
      width: 2,
      height: 6,
      inactive: 300,
      status: "off",
      timelineOn: [
        { type: "camera-shake", value: 1, delay: 250 },
        { type: "door", target: "enter-door", status: "on", delay: 0 }
      ],
      timelineOff: [
        { type: "door", target: "enter-door", status: "off", delay: 0 }
      ]
    },

    // trigger first door
    t_1: {
      type: "once",
      width: 2,
      height: 10,
      timeline: [
        { type: "camera-shake", value: 1, delay: 250 },
        { type: "door", target: "d_1", status: "on", delay: 0 },
        {
          type: "play-audio",
          delay: 200,
          key: "close-door",
          volume: 0.5
        }
      ]
    },
    t_2: {
      type: "once",
      width: 2,
      height: 10,
      timeline: [
        { type: "camera-shake", value: 1, delay: 250 },
        { type: "door", target: "d_2", status: "on", delay: 0 },
        {
          type: "play-audio",
          delay: 200,
          key: "close-door",
          volume: 0.5
        },
        { type: "respawn", respawn: 2 }
      ]
    },
    t_3: {
      type: "once",
      width: 2,
      height: 3,
      timeline: [{ type: "door", target: "d_10", status: "off", delay: 0 }]
    },

    t_4: {
      type: "switch",
      width: 1,
      height: 3,
      inactive: 300,
      status: "off",
      timelineOn: [
        {
          type: "teleport",
          target: "teleport-0",
          status: "on",
          delay: 0
        }
      ],
      timelineOff: [
        {
          type: "teleport",
          target: "teleport-0",
          status: "off",
          delay: 0
        }
      ]
    },

    t_5: {
      type: "switch",
      width: 1,
      height: 3,
      inactive: 300,
      status: "off",
      timelineOn: [
        {
          type: "teleport",
          target: "teleport-1",
          status: "on",
          delay: 0
        }
      ],
      timelineOff: [
        {
          type: "teleport",
          target: "teleport-1",
          status: "off",
          delay: 0
        }
      ]
    },

    d_1: GameAnim.doorAnim3,
    d_2: GameAnim.doorAnim3,
    d_3: GameAnim.doorAnim3,
    d_4: GameAnim.doorAnim3,
    d_5: GameAnim.doorAnim3,
    d_6: GameAnim.doorAnim3,
    d_7: GameAnim.doorAnim3,
    d_8: GameAnim.doorAnim3,
    d_9: GameAnim.doorAnim4,
    d_10: GameAnim.doorAnim3,

    s_1: {
      key: 0,
      trigger: {
        type: "door",
        target: "d_1",
        status: "off",
        delay: 1000
      }
    },

    s_2: {
      key: 1,
      trigger: {
        type: "door",
        target: "d_1",
        status: "off",
        delay: 1000
      }
    },

    d_0: GameAnim.doorAnim5
  }
};
