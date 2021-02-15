import "phaser";
import EnemyDataConst, { EnemyData } from "../data/enemyData";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  life: number;
  enemyDeets: EnemyData;
  enemyLvl: number;
  parent: EnemyGroup;
  constructor(scene, x, y) {
    super(scene, x, y, "enemy");
  }

  spawn(
    p: EnemyGroup,
    enemyLevel?: number,
    spawnPostion?: Phaser.Math.Vector2,
    spawnVel?: Phaser.Math.Vector2,
    index?: number
  ) {
    this.parent = p;
    this.enemyLvl = enemyLevel ?? Phaser.Math.Between(1, 7);
    const enemyData = EnemyDataConst[this.enemyLvl];

    this.enemyDeets = enemyData;

    this.setTexture(enemyData.img);

    this.life = enemyData.hp;
    var customBounds = new Phaser.Geom.Rectangle(0, -100, 400, 700);
    let bod = this.body as Phaser.Physics.Arcade.Body;
    bod
      .setCircle(enemyData.size)
      .setCollideWorldBounds(true, 1, 0, true)
      .setBoundsRectangle(customBounds);
    bod.enable = true;

    this.setTint(
      enemyData.mainTint,
      enemyData.mainTint,
      enemyData.mainTint,
      enemyData.mainTint
    );

    if (spawnPostion) {
      this.body.reset(spawnPostion.x, spawnPostion.y);
      this.setVelocity(index == 0 ? spawnVel.x : -spawnVel.x, -200);
    } else {
      this.body.reset(Phaser.Math.Between(0, 400), -50);
      this.setVelocityX(Phaser.Math.Between(0, 100) > 50 ? -100 : 100);
    }

    this.setActive(true);
    this.setVisible(true);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }

  addDamage(dmg: number) {
    this.life -= dmg;
    var vel = this.body.velocity.y;

    this.setVelocityY(vel < 0 ? vel * 0.3 + -100 : -100);
    // console.log(this.life);
    if (this.life <= 0) {
      this.body.enable = false;
      if (this.enemyLvl > 1) {
        for (var i = 0; i < 2; i++) {
          let enemy = this.parent.getFirstDead(false) as Enemy;
          enemy.spawn(
            this.parent,
            this.enemyLvl - 1,
            this.body.position,
            this.body.velocity,
            i
          );
        }
      }

      this.recycle();
      var emitter = this.scene.data.get("emitter");
      this.scene.data.set("score", this.scene.data.get("score") + 1);
      emitter.emit("updateUI");
    } else {
      if (this.life <= this.enemyDeets.hp / 2) {
        this.setTint(
          this.enemyDeets.mainTint,
          this.enemyDeets.mainTint,
          this.enemyDeets.targetTint,
          this.enemyDeets.targetTint
        );
      }
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
      key: "enemy1",
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
      enemy.spawn(this);
    }
  }

  removeEnemy(enemy: Enemy | any) {
    if (!(enemy instanceof Enemy)) {
      return;
    }
    enemy.recycle();
  }

  damageEnemy(enemy: Enemy | any, dmg: number) {
    if (!(enemy instanceof Enemy)) {
      return;
    }

    (enemy as Enemy).addDamage(dmg);
  }
}
