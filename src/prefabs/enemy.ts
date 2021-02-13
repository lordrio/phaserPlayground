import "phaser";
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  life: number;
  constructor(scene, x, y) {
    super(scene, x, y, "enemy");
  }

  spawn() {
    this.life = 2;
    var customBounds = new Phaser.Geom.Rectangle(0, -100, 400, 700);
    let bod = this.body as Phaser.Physics.Arcade.Body;
    bod
      .setCircle(12)
      .setCollideWorldBounds(true, 1, 0, true)
      .setBoundsRectangle(customBounds);
    bod.enable = true;

    this.body.reset(Phaser.Math.Between(0, 400), -50);

    this.setTint(0xbdbdbd, 0xbdbdbd, 0xbdbdbd, 0xbdbdbd);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(Phaser.Math.Between(0, 100) > 50 ? -100 : 100);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }

  addDamage(dmg: number) {
    this.life -= dmg;
    console.log(this.body.velocity.y);
    this.setVelocityY(-100);
    console.log(this.life);
    if (this.life <= 0) {
      this.recycle();
    }
  }

  recycle() {
    this.setActive(false);
    this.setVisible(false);
    let bod = this.body as Phaser.Physics.Arcade.Body;
    bod.enable = false;
  }
}

export default class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 100,
      key: "enemy",
      active: false,
      visible: false,
      classType: Enemy,
    });
  }

  spawnEnemy() {
    let enemy = this.getFirstDead(false);
    if (this.getTotalUsed() >= 100) {
      return;
    }

    if (enemy) {
      enemy.spawn();
    }
  }

  damageEnemy(enemy: Enemy | any, dmg: number) {
    console.log(enemy instanceof Enemy);
    if (!(enemy instanceof Enemy)) {
      return;
    }

    (enemy as Enemy).addDamage(dmg);
  }
}
