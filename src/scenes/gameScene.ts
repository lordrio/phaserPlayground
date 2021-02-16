import "phaser";
import { emit } from "process";
import { GRAVITY } from "../Constant";
import EnemyGp, { Enemy } from "../prefabs/enemy";
import Bullets from "../prefabs/bullets";

export default class GameSceen extends Phaser.Scene {
  particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  enemy: EnemyGp;
  bullets: Bullets;

  constructor() {
    super("GameSceen");
  }

  preload() {
    this.load.image("sky", "assets/space3.png");
    this.load.svg("logo", "assets/player/lvl1.svg");
    this.load.image("red", "assets/red.png");
    this.load.image("bullet", "assets/shot1_4.png");
    this.load.image("platform", "assets/platform.png");
    this.load.svg("circle", "assets/circle.svg");

    this.load.svg("enemy", "assets/enemy/lvl1.svg");

    this.load.svg("enemy1", "assets/enemy/lvl1.svg");
    this.load.svg("enemy2", "assets/enemy/lvl2.svg");
    this.load.svg("enemy3", "assets/enemy/lvl3.svg");
    this.load.svg("enemy4", "assets/enemy/lvl4.svg");
    this.load.svg("enemy5", "assets/enemy/lvl5.svg");
    this.load.svg("enemy6", "assets/enemy/lvl6.svg");
    this.load.svg("enemy7", "assets/enemy/lvl7.svg");
  }

  create() {
    this.add.image(400, 300, "sky");

    this.particles = this.add.particles("red");

    //====================== player ======================
    this.player = this.physics.add
      .sprite(200, 600 - 87 / 2, "logo")
      .setImmovable(true)
      .setGravityY(-GRAVITY);
    // this.player.setImmovable(false);
    this.player.setBodySize(35, 47, true);

    this.input.setDraggable(this.player.setInteractive());

    this.input.on("dragstart", function (pointer, obj) {
      console.log(obj === this.player);
      obj.body.moves = false;
    });

    console.log(
      this.sys.game.canvas.width,
      this.sys.game.canvas.clientWidth,
      this.sys.game.canvas.offsetWidth,
      this.sys.game.canvas.scrollWidth
    );

    const screenWidth = this.sys.game.canvas.width;
    this.input.on("drag", function (pointer, obj, dragX, dragY) {
      if (dragX <= 30) {
        dragX = 30;
      }
      if (dragX >= screenWidth - 30) {
        dragX = screenWidth - 30;
      }
      obj.setPosition(dragX, obj.y);
    });

    this.input.on("dragend", function (pointer, obj) {
      obj.body.moves = true;
    });
    //====================== player ======================

    //====================== Enemy ======================
    this.enemy = new EnemyGp(this);
    this.bullets = new Bullets(this);

    // for enemy
    this.physics.world.on(
      "worldbounds",
      (body: Phaser.Physics.Arcade.Body, up, down, left, right) => {
        // console.log(body.acceleration, body.velocity, up, down, left, right);
        if (down) {
          if (body.gameObject instanceof Enemy) {
            var lvl = body.gameObject.enemyLvl;
            var scaley = Phaser.Math.Linear(1.0, 1.5, (lvl - 1) / 6);
            body.setVelocityY(-350 * scaley);
          }
        } else {
        }
      }
    );
    //====================== Enemy ======================

    // player enemy collisio0n
    this.physics.add.overlap(this.player, this.enemy, (o1, o2) => {
      //   console.log(o1, o2);
      // hit with player
      if (o1.active && o2.active) {
        this.enemy.removeEnemy(o2);
        this.data.set("hp", this.data.get("hp") - 1);
        this.data.get("emitter").emit("updateUI");
      }
    });

    this.physics.add.overlap(
      this.bullets,
      this.enemy,
      (o1, o2) => {
        // console.log("hit", o1.type, o2.type);
        if (o1.active && o2.active) {
          this.enemy.damageEnemy(o2, 1);
          this.bullets.recycleBullets(o1);
        }
      },
      (o1, o2) => {
        return o1.active && o2.active;
      }
    );

    /// UI
    var text = this.add.text(0, 0, "", {
      font: "24px Courier",
      color: "#00ff00",
    });

    this.add.text(100, 100, "🎃", {
      font: "64px Courier",
      color: "#00ff00",
    });

    var emitter = new Phaser.Events.EventEmitter();
    //  Set-up an event handler
    emitter.on(
      "updateUI",
      () => {
        text.setText([
          "Level: " + this.data.get("level"),
          "Lives: " + this.data.get("hp"),
          "Score: " + this.data.get("score"),
        ]);
      },
      this
    );

    this.data.set("level", 1);
    this.data.set("hp", 10);
    this.data.set("score", 0);
    this.data.set("emitter", emitter);

    emitter.emit("updateUI");
  }

  autoShoot() {
    this.bullets.fireBullet(this.player.x, this.player.y - 44);
  }

  t = 0.0;
  spawnTimer = 0.0;
  update(time, delta) {
    const fireRate = 1 / 10.0;
    var dt = delta / 1000.0;
    this.t += dt;
    if (this.t >= fireRate) {
      this.t = 0;
      this.autoShoot();
    }

    this.spawnTimer += dt;
    if (this.spawnTimer >= 3) {
      this.spawnTimer = 0;
      this.enemy.spawnEnemy();
    }
  }
}
