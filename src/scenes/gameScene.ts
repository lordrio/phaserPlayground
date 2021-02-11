import "phaser";

export default class GameSceen extends Phaser.Scene {
  particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor() {
    super("GameSceen");
  }

  preload() {
    this.load.image("sky", "assets/space3.png");
    this.load.image("logo", "assets/plane.png");
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
    enemy.setBounce(1);
    enemy.setCollideWorldBounds(true);
    enemy.body.setCircle(12);
    enemy.setVelocity(100, 200);
  }

  autoShoot() {
    var emitter = this.particles.createEmitter({
      speed: 10,
      scale: { start: 0.4, end: 0 },
      blendMode: "ADD",
      lifespan: 300.0,
    });
    var item = this.physics.add
      .image(this.player.x, this.player.y, "bullet")
      .setVisible(false);
    item.angle = -90;
    item.setVelocity(0, -800);
    emitter.startFollow(item);
    item.body.setAllowGravity(false);
  }

  t = 0.0;
  update(time, delta) {
    var dt = delta / 1000.0;
    this.t += dt;
    if (this.t >= 0.5) {
      this.t = 0;
      this.autoShoot();
    }
  }
}
