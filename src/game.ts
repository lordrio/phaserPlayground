import "phaser";
import Pellow from "./test";
import GameSceen from "./scenes/gameScene";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#125555",
  width: 400,
  height: 600,
  scene: [GameSceen, Pellow],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
};

const game = new Phaser.Game(config);
