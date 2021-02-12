import "phaser";
import { GameObjects } from "phaser";
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy");
  }

  spawn() {
    var customBounds = new Phaser.Geom.Rectangle(0, -100, 400, 700);
    let bod = this.body as Phaser.Physics.Arcade.Body;
    bod
      .setCircle(12)
      .setCollideWorldBounds(true, 1, 0, true)
      .setBoundsRectangle(customBounds);

    this.body.reset(Phaser.Math.Between(0, 400), -50);

    this.setTint(0xbdbdbd, 0xbdbdbd, 0xbdbdbd, 0xbdbdbd);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(Phaser.Math.Between(0, 100) > 50 ? -100 : 100);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}

export default class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 1000,
      key: "enemy",
      active: false,
      visible: false,
      classType: Enemy,
    });
  }

  spawnEnemy() {
    let enemy = this.getFirstDead(false);
    if (this.getTotalUsed() >= 50) {
      return;
    }

    if (enemy) {
      enemy.spawn();
    }
  }
}
