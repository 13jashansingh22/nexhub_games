import Phaser from 'phaser';

export default class BrickBreaker extends Phaser.Scene {
  constructor() {
    super('BrickBreaker');
    this.paddle = null;
    this.ball = null;
    this.bricks = null;
    this.score = 0;
    this.scoreText = null;
    this.lives = 3;
    this.gameOver = false;
    this.powerUp = null;
    this.powerType = null;
  }

  preload() {
    this.load.image('paddle', 'https://labs.phaser.io/assets/sprites/paddle.png');
    this.load.image('ball', 'https://labs.phaser.io/assets/sprites/shinyball.png');
    this.load.image('brick', 'https://labs.phaser.io/assets/sprites/brick.png');
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('power', 'https://labs.phaser.io/assets/sprites/magnet.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.paddle = this.physics.add.sprite(240, 680, 'paddle').setImmovable(true);
    this.paddle.setCollideWorldBounds(true);
    this.ball = this.physics.add.sprite(240, 660, 'ball').setCollideWorldBounds(true).setBounce(1);
    this.ball.setVelocity(200, -200);
    this.bricks = this.physics.add.staticGroup();
    for (let y = 100; y < 300; y += 32) {
      for (let x = 60; x < 420; x += 64) {
        const brick = this.bricks.create(x, y, 'brick');
        brick.setData('strength', Phaser.Math.Between(1, 2));
      }
    }
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    this.input.on('pointermove', pointer => {
      this.paddle.x = Phaser.Math.Clamp(pointer.x, 60, 420);
    });
    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
    this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
    this.powerUp = this.physics.add.sprite(-100, -100, 'power').setVisible(false);
    this.physics.add.overlap(this.paddle, this.powerUp, this.collectPower, null, this);
  }

  hitPaddle(ball, paddle) {
    ball.setVelocityY(-Math.abs(ball.body.velocity.y));
  }

  hitBrick(ball, brick) {
    let strength = brick.getData('strength');
    if (strength > 1) {
      brick.setData('strength', strength - 1);
      brick.setTint(0xff4444);
    } else {
      brick.destroy();
      this.score += 10;
      this.scoreText.setText('Score: ' + this.score);
      if (Phaser.Math.Between(0, 10) < 2 && !this.powerUp.visible) {
        this.powerUp.setPosition(brick.x, brick.y);
        this.powerUp.setVisible(true);
        this.powerType = Phaser.Math.Between(0, 1) ? 'multi' : 'big';
        this.powerUp.setVelocityY(100);
      }
    }
  }

  collectPower(paddle, power) {
    if (this.powerType === 'multi') {
      for (let i = 0; i < 2; i++) {
        const newBall = this.physics.add.sprite(this.ball.x, this.ball.y, 'ball').setCollideWorldBounds(true).setBounce(1);
        newBall.setVelocity(Phaser.Math.Between(-200, 200), -200);
        this.physics.add.collider(newBall, this.paddle, this.hitPaddle, null, this);
        this.physics.add.collider(newBall, this.bricks, this.hitBrick, null, this);
      }
    } else if (this.powerType === 'big') {
      this.paddle.setScale(2, 1);
      this.time.delayedCall(4000, () => this.paddle.setScale(1, 1));
    }
    power.setVisible(false);
    power.setPosition(-100, -100);
  }

  update() {
    if (this.gameOver) return;
    if (this.ball.y > 720) {
      this.lives--;
      if (this.lives <= 0) {
        this.endGame();
      } else {
        this.ball.setPosition(240, 660);
        this.ball.setVelocity(200, -200);
      }
    }
    if (this.powerUp.visible && this.powerUp.y > 720) {
      this.powerUp.setVisible(false);
      this.powerUp.setPosition(-100, -100);
    }
    if (this.bricks.countActive() === 0) {
      this.endGame();
    }
  }

  endGame() {
    this.gameOver = true;
    this.add.text(120, 360, 'Game Over\nClick to Restart', { fontSize: '32px', fill: '#ff4444', align: 'center' });
    this.input.once('pointerdown', () => this.scene.restart(), this);
  }
}
