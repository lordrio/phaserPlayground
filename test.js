var config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image("sky", "assets/space3.png");
  this.load.image("logo", "assets/plane.png");
  this.load.image("red", "assets/red.png");
  this.load.image("bullet", "assets/shot1_4.png");
  this.load.image("platform", "assets/platform.png");
  this.load.svg("circle", "assets/circle.svg");
}

function create() {
  this.add.image(400, 300, "sky");

  var particles = this.add.particles("red");

  var emitter = particles.createEmitter({
    speed: 10,
    scale: { start: 0.5, end: 0 },
    blendMode: "ADD",
  });

  var logo = this.physics.add.image(200, 800, "logo");

  // logo.setVelocity(100, 200);
  logo.setBounce(0.5);
  logo.setCollideWorldBounds(true);

  emitter.startFollow(logo);

  this.input.setDraggable(logo.setInteractive());

  this.input.on("dragstart", function (pointer, obj) {
    obj.body.moves = false;
  });

  this.input.on("drag", function (pointer, obj, dragX, dragY) {
    obj.setPosition(dragX, obj.y);
  });

  this.input.on("dragend", function (pointer, obj) {
    obj.body.moves = true;
  });

  autoShoot(particles, this);

  var enemy = this.physics.add
    .image(100, 100, "circle")
    .setTint(0xbdbdbd, 0xbdbdbd, 0xbdbdbd, 0xbdbdbd);
  enemy.setBounce(1);
  enemy.setCollideWorldBounds(true);
  enemy.body.setCircle(12);
  enemy.setVelocity(100, 200);
}

function autoShoot(particles, p) {
  var emitter = particles.createEmitter({
    speed: 10,
    scale: { start: 0.4, end: 0 },
    blendMode: "ADD",
  });
  var item = p.physics.add.image(200, 400, "bullet").setVisible(false);
  item.angle = -90;
  item.setVelocity(0, -800);
  emitter.startFollow(item);
  item.body.setAllowGravity(false);
}

function update() {}
