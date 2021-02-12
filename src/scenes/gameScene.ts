import "phaser";
import { emit } from "process";
import { GRAVITY } from "../Constant";
import Enemy from "../prefabs/enemy";

export default class GameSceen extends Phaser.Scene {
  particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  bullets: {
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    obj: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  }[];
  enemy: Enemy;

  constructor() {
    super("GameSceen");
    this.bullets = [];
  }

  preload() {
    this.load.image("sky", "assets/space3.png");
    this.load.svg("logo", "assets/player.svg");
    this.load.image("red", "assets/red.png");
    this.load.image("bullet", "assets/shot1_4.png");
    this.load.image("platform", "assets/platform.png");
    this.load.svg("circle", "assets/circle.svg");

    this.load.svg("enemy", "assets/circle.svg");
  }

  create() {
    this.add.image(400, 300, "sky");

    this.particles = this.add.particles("red");

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

    this.input.on("drag", function (pointer, obj, dragX, dragY) {
      obj.setPosition(dragX, obj.y);
    });

    this.input.on("dragend", function (pointer, obj) {
      obj.body.moves = true;
    });

    this.autoShoot();

    this.enemy = new Enemy(this);

    var enemy = this.physics.add
      .image(100, 100, "circle")
      .setTint(0xbdbdbd, 0xbdbdbd, 0xbdbdbd, 0xbdbdbd);
    enemy.body.setCircle(12);
    enemy.body.setCollideWorldBounds(true, 0, 0, true);

    this.physics.world.on(
      "worldbounds",
      (body: Phaser.Physics.Arcade.Body, up, down, left, right) => {
        // console.log(body.acceleration, body.velocity, up, down, left, right);
        if (down) {
          body.setVelocityY(-300);
        } else {
        }
      }
    );

    this.physics.add.overlap(this.player, this.enemy, (o1, o2) => {
      //   console.log(o1, o2);
      // hit with player
    });
  }

  autoShoot() {
    var emitter = this.particles.createEmitter({
      speed: { start: 40, end: 10 },
      scale: { start: 0.4, end: 0 },
      blendMode: "ADD",
      lifespan: 100.0,
    } as Phaser.Types.GameObjects.Particles.ParticleEmitterConfig);

    var item = this.physics.add
      .sprite(this.player.x, this.player.y, "bullet")
      .setVisible(false);
    item.angle = -90;
    item.setVelocity(0, -800);
    emitter.startFollow(item);
    item.body.setAllowGravity(false);
    this.bullets.push({ emitter, obj: item });
  }

  t = 0.0;
  cleaningTimer = 0.0;
  spawnTimer = 0.0;
  update(time, delta) {
    const fireRate = 1 / 10.0;
    var dt = delta / 1000.0;
    this.t += dt;
    this.cleaningTimer += dt;
    if (this.t >= fireRate) {
      this.t = 0;
      this.autoShoot();
    }

    if (this.cleaningTimer >= 5) {
      this.bullets = this.bullets
        .map((val) => {
          const { emitter, obj } = val;
          if (obj.y <= -1000) {
            obj.destroy();
            this.particles.removeEmitter(emitter);
            return null;
          }
          return val;
        })
        .filter(Boolean);
      this.cleaningTimer = 0;
    }
    // console.log(this.bullets.length);
    // console.log(this.game.loop.actualFps);

    this.spawnTimer += dt;
    if (this.spawnTimer >= 1) {
      this.spawnTimer = 0;
      this.enemy.spawnEnemy();
    }
  }
}
