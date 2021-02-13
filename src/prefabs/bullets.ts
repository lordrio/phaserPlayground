import "phaser";

class Bullet extends Phaser.Physics.Arcade.Sprite {
  emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  timeout: NodeJS.Timeout;
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
  }

  fire(x, y, emitter: Phaser.GameObjects.Particles.ParticleEmitter) {
    this.body.reset(x, y);
    this.emitter = emitter;

    this.setActive(true);
    this.setVisible(false);

    this.setVelocityY(-800);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.setBodySize(7, 10, true);

    emitter.startFollow(this);

    clearTimeout(this.timeout);
    this.body.enable = true;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.y <= 0) {
      this.recycle();
    }
  }

  recycle() {
    this.setActive(false);
    this.setVisible(false);
    this.emitter.stop();
    this.timeout = setTimeout(() => {
      this.emitter.remove();
      this.emitter = null;
    }, 500);
    this.body.enable = false;
  }
}

export default class Bullets extends Phaser.Physics.Arcade.Group {
  particles: Phaser.GameObjects.Particles.ParticleEmitterManager;

  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 50,
      key: "bullet",
      active: false,
      visible: false,
      classType: Bullet,
    });
    this.particles = scene.add.particles("red");
  }

  recycleBullets(bullet: Bullet | any) {
    bullet.recycle();
  }

  fireBullet(x, y) {
    let bullet = this.getFirstDead(false);
    if (!bullet) {
      return;
    }

    var emitter = this.particles.createEmitter({
      speed: { start: 40, end: 10 },
      scale: { start: 0.4, end: 0 },
      blendMode: "ADD",
      lifespan: 100.0,
    } as Phaser.Types.GameObjects.Particles.ParticleEmitterConfig);

    if (bullet) {
      bullet.fire(x, y, emitter);
    }
  }
}
