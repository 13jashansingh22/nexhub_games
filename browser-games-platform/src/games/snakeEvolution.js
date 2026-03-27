import Phaser from 'phaser';

export default class SnakeEvolution extends Phaser.Scene {
  constructor() {
    super('SnakeEvolution');
    this.snake = [];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.food = null;
    this.score = 0;
    this.scoreText = null;
    this.speed = 100;
    this.moveTimer = 0;
    this.gameOver = false;
    this.powerUp = null;
    this.powerType = null;
    this.powerTimer = 0;
  }

  preload() {
    this.load.image('snake', 'https://labs.phaser.io/assets/sprites/block.png');
    this.load.image('food', 'https://labs.phaser.io/assets/sprites/apple.png');
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('power', 'https://labs.phaser.io/assets/sprites/magnet.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.snake = [this.add.rectangle(240, 360, 20, 20, 0x44ff99)];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.speed = 100;
    this.moveTimer = 0;
    this.gameOver = false;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    this.spawnFood();
    this.powerUp = this.add.sprite(-100, -100, 'power').setVisible(false);
    this.powerType = null;
    this.powerTimer = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown', this.handleKey, this);
  }

  handleKey(e) {
    if (e.code === 'ArrowUp' && this.direction !== 'down') this.nextDirection = 'up';
    else if (e.code === 'ArrowDown' && this.direction !== 'up') this.nextDirection = 'down';
    else if (e.code === 'ArrowLeft' && this.direction !== 'right') this.nextDirection = 'left';
    else if (e.code === 'ArrowRight' && this.direction !== 'left') this.nextDirection = 'right';
  }

  spawnFood() {
    const x = Phaser.Math.Snap.To(Phaser.Math.Between(40, 440), 20);
    const y = Phaser.Math.Snap.To(Phaser.Math.Between(40, 680), 20);
    if (this.food) this.food.destroy();
    this.food = this.add.sprite(x, y, 'food').setScale(0.7);
  }

  spawnPowerUp() {
    const x = Phaser.Math.Snap.To(Phaser.Math.Between(40, 440), 20);
    const y = Phaser.Math.Snap.To(Phaser.Math.Between(40, 680), 20);
    this.powerUp.setPosition(x, y);
    this.powerUp.setVisible(true);
    this.powerType = Phaser.Math.Between(0, 1) ? 'grow' : 'slow';
    this.powerTimer = 200;
  }

  update() {
    if (this.gameOver) return;
    this.moveTimer++;
    if (this.moveTimer > (this.powerType === 'slow' ? 10 : 5)) {
      this.moveSnake();
      this.moveTimer = 0;
    }
    // Power-up spawn
    if (!this.powerUp.visible && Phaser.Math.Between(0, 1000) < 2) {
      this.spawnPowerUp();
    }
    if (this.powerUp.visible && this.powerTimer-- <= 0) {
      this.powerUp.setVisible(false);
    }
    // Check collision with power-up
    if (this.powerUp.visible && Phaser.Math.Distance.Between(this.snake[0].x, this.snake[0].y, this.powerUp.x, this.powerUp.y) < 15) {
      if (this.powerType === 'grow') {
        for (let i = 0; i < 3; i++) this.snake.push(this.add.rectangle(-20, -20, 20, 20, 0x44ff99));
      } else if (this.powerType === 'slow') {
        this.moveTimer = -20;
      }
      this.powerUp.setVisible(false);
    }
  }

  moveSnake() {
    this.direction = this.nextDirection;
    let dx = 0, dy = 0;
    if (this.direction === 'up') dy = -20;
    else if (this.direction === 'down') dy = 20;
    else if (this.direction === 'left') dx = -20;
    else if (this.direction === 'right') dx = 20;
    const newX = this.snake[0].x + dx;
    const newY = this.snake[0].y + dy;
    // Check collision with self or wall
    if (newX < 20 || newX > 460 || newY < 20 || newY > 700 || this.snake.some((s, i) => i && s.x === newX && s.y === newY)) {
      this.endGame();
      return;
    }
    // Move body
    for (let i = this.snake.length - 1; i > 0; i--) {
      this.snake[i].x = this.snake[i - 1].x;
      this.snake[i].y = this.snake[i - 1].y;
    }
    this.snake[0].x = newX;
    this.snake[0].y = newY;
    // Check food
    if (Phaser.Math.Distance.Between(newX, newY, this.food.x, this.food.y) < 15) {
      this.snake.push(this.add.rectangle(-20, -20, 20, 20, 0x44ff99));
      this.score++;
      this.scoreText.setText('Score: ' + this.score);
      this.spawnFood();
      this.speed += 2;
    }
  }

  endGame() {
    this.gameOver = true;
    this.add.text(120, 360, 'Game Over\nClick to Restart', { fontSize: '32px', fill: '#ff4444', align: 'center' });
    this.input.once('pointerdown', () => this.scene.restart(), this);
  }
}
