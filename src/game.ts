import "phaser";
import Pellow from "./test";
import GameSceen from "./scenes/gameScene";
import { GRAVITY } from "./Constant";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#1C1C1C",
  width: 400,
  height: 600,
  scene: [GameSceen, Pellow],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: GRAVITY },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);
