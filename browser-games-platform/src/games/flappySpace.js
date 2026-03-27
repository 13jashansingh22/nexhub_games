import Phaser from 'phaser';

export default class FlappySpace extends Phaser.Scene {
  constructor() {
    super('FlappySpace');
    this.player = null;
    this.pipes = null;
    this.score = 0;
    this.scoreText = null;
    this.gameOver = false;
    this.gravitySwitch = false;
    this.gravityTimer = 0;
  }

  preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/ufo.png');
    this.load.image('pipe', 'https://labs.phaser.io/assets/sprites/column.png');
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('gravity', 'https://labs.phaser.io/assets/sprites/magnet.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.player = this.physics.add.sprite(120, 360, 'player').setScale(1.1);
    this.player.setGravityY(800);
    this.pipes = this.physics.add.group();
    this.score = 0;
    this.gameOver = false;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    this.input.on('pointerdown', this.flap, this);
    this.spawnTimer = 0;
    this.gravitySwitch = false;
    this.gravityTimer = 0;
    this.physics.add.overlap(this.player, this.pipes, this.hitPipe, null, this);
    this.powerUp = this.physics.add.sprite(600, Phaser.Math.Between(100, 620), 'gravity').setVisible(false);
    this.physics.add.overlap(this.player, this.powerUp, this.collectGravity, null, this);
  }

  flap() {
    if (this.gameOver) return;
    if (this.gravitySwitch) {
      this.player.setVelocityY(400);
    } else {
      this.player.setVelocityY(-400);
    }
  }

  spawnPipe() {
    const gap = 180;
    const top = Phaser.Math.Between(100, 500);
    const upper = this.pipes.create(520, top - gap / 2 - 320, 'pipe');
    upper.setImmovable(true);
    upper.body.allowGravity = false;
    upper.setScale(1, 2);
    const lower = this.pipes.create(520, top + gap / 2 + 320, 'pipe');
    lower.setImmovable(true);
    lower.body.allowGravity = false;
    lower.setScale(1, 2);
    upper.setVelocityX(-200);
    lower.setVelocityX(-200);
  }

  spawnGravityPower() {
    this.powerUp.setPosition(600, Phaser.Math.Between(100, 620));
    this.powerUp.setVisible(true);
    this.powerUp.setVelocityX(-200);
  }

  collectGravity(player, power) {
    this.gravitySwitch = !this.gravitySwitch;
    this.gravityTimer = 300;
    this.player.setGravityY(this.gravitySwitch ? -800 : 800);
    power.setVisible(false);
    power.setVelocityX(0);
  }

  hitPipe() {
    this.physics.pause();
    this.gameOver = true;
    this.add.text(120, 360, 'Game Over\nClick to Restart', { fontSize: '32px', fill: '#ff4444', align: 'center' });
    this.input.once('pointerdown', () => this.scene.restart(), this);
  }

  update() {
    if (this.gameOver) return;
    // Spawn pipes
    this.spawnTimer++;
    if (this.spawnTimer > 80) {
      this.spawnPipe();
      this.spawnTimer = 0;
    }
    // Remove off-screen pipes
    this.pipes.children.iterate(child => { if (child && child.x < -50) child.destroy(); });
    // Score
    this.pipes.children.iterate(child => {
      if (child && !child.scored && child.x < this.player.x) {
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
        child.scored = true;
      }
    });
    // Gravity power-up
    if (!this.powerUp.visible && Phaser.Math.Between(0, 1000) < 2) {
      this.spawnGravityPower();
    }
    if (this.powerUp.visible && this.powerUp.x < -50) {
      this.powerUp.setVisible(false);
      this.powerUp.setVelocityX(0);
    }
    // Gravity timer
    if (this.gravitySwitch) {
      this.gravityTimer--;
      if (this.gravityTimer <= 0) {
        this.gravitySwitch = false;
        this.player.setGravityY(800);
      }
    }
    // Game over if out of bounds
    if (this.player.y < 0 || this.player.y > 720) {
      this.hitPipe();
    }
  }
}
