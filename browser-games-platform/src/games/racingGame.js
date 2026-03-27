import Phaser from 'phaser';

export default class RacingGame extends Phaser.Scene {
  constructor() {
    super('RacingGame');
    this.player = null;
    this.cursors = null;
    this.aiCars = null;
    this.score = 0;
    this.scoreText = null;
    this.speed = 300;
    this.nitro = 0;
    this.gameOver = false;
  }

  preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/car90.png');
    this.load.image('ai', 'https://labs.phaser.io/assets/sprites/car_red_small_1.png');
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('nitro', 'https://labs.phaser.io/assets/sprites/magnet.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.player = this.physics.add.sprite(240, 600, 'player').setScale(1.1);
    this.player.setCollideWorldBounds(true);
    this.aiCars = this.physics.add.group();
    this.score = 0;
    this.speed = 300;
    this.nitro = 0;
    this.gameOver = false;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spawnTimer = 0;
    this.nitroPower = this.physics.add.sprite(-100, -100, 'nitro').setVisible(false);
    this.physics.add.overlap(this.player, this.aiCars, this.hitCar, null, this);
    this.physics.add.overlap(this.player, this.nitroPower, this.collectNitro, null, this);
  }

  spawnAICar() {
    const laneX = [120, 240, 360][Phaser.Math.Between(0, 2)];
    const ai = this.aiCars.create(laneX, -80, 'ai');
    ai.setVelocityY(this.speed);
    ai.setImmovable(true);
    ai.setScale(1.1);
  }

  collectNitro(player, nitro) {
    this.nitro = 200;
    nitro.setVisible(false);
    nitro.setPosition(-100, -100);
  }

  hitCar(player, ai) {
    this.speed = Math.max(200, this.speed - 100);
    ai.destroy();
  }

  update() {
    if (this.gameOver) return;
    // Move left/right
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
    } else {
      this.player.setVelocityX(0);
    }
    // Nitro
    if (this.nitro > 0) {
      this.speed = 600;
      this.nitro--;
    } else {
      this.speed = Math.min(this.speed + 0.02, 500);
    }
    // Spawn AI cars
    this.spawnTimer++;
    if (this.spawnTimer > 40) {
      this.spawnAICar();
      this.spawnTimer = 0;
    }
    // Remove off-screen AI cars
    this.aiCars.children.iterate(child => { if (child && child.y > 800) child.destroy(); });
    // Nitro power-up
    if (!this.nitroPower.visible && Phaser.Math.Between(0, 1000) < 2) {
      this.nitroPower.setPosition([120, 240, 360][Phaser.Math.Between(0, 2)], -80);
      this.nitroPower.setVisible(true);
      this.nitroPower.setVelocityY(this.speed);
    }
    if (this.nitroPower.visible && this.nitroPower.y > 800) {
      this.nitroPower.setVisible(false);
      this.nitroPower.setPosition(-100, -100);
    }
    // Score
    this.score += this.speed / 1000;
    this.scoreText.setText('Score: ' + Math.floor(this.score));
    // Game over if crash too much
    if (this.speed <= 200) {
      this.physics.pause();
      this.gameOver = true;
      this.add.text(120, 360, 'Game Over\nClick to Restart', { fontSize: '32px', fill: '#ff4444', align: 'center' });
      this.input.once('pointerdown', () => this.scene.restart(), this);
    }
  }
}
