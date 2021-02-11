import "phaser";
import { emit } from "process";

export default class GameSceen extends Phaser.Scene {
  particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  bullets: {
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    obj: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  }[];

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
  }

  create() {
    this.add.image(400, 300, "sky");

    this.particles = this.add.particles("red");

    this.player = this.physics.add.sprite(200, 800, "logo");

    // logo.setVelocity(100, 200);
    this.player.setBounce(0.5);
    this.player.setCollideWorldBounds(true);

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

    var enemy = this.physics.add
      .image(100, 100, "circle")
      .setTint(0xbdbdbd, 0xbdbdbd, 0xbdbdbd, 0xbdbdbd);
    // enemy.setBounce(1);
    // enemy.setCollideWorldBounds(true);
    enemy.body.setCircle(12);
    enemy.body.setCollideWorldBounds(true, 0, 0, true);
    // enemy.setVelocity(100, 200);

    this.physics.world.on(
      "worldbounds",
      (body: Phaser.Physics.Arcade.Body, up, down, left, right) => {
        console.log(body.acceleration, body.velocity, up, down, left, right);
        body.setVelocityY(-300);
      }
    );
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
  }
}
