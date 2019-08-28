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
      time: 50,
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
      frames: 30
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
      name: "ouas",
      path: "assets/images/game/ouas.png"
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
  ]
};
