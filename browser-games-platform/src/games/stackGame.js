import Phaser from 'phaser';

export default class StackGame extends Phaser.Scene {
  constructor() {
    super('StackGame');
    this.stack = [];
    this.currentBlock = null;
    this.direction = 1;
    this.speed = 4;
    this.score = 0;
    this.scoreText = null;
    this.gameOver = false;
  }

  preload() {
    this.load.image('block', 'https://labs.phaser.io/assets/sprites/block.png');
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.stack = [];
    this.score = 0;
    this.speed = 4;
    this.gameOver = false;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    this.addBlock(240, 680, 200);
    this.spawnBlock();
    this.input.on('pointerdown', this.dropBlock, this);
  }

  addBlock(x, y, width) {
    const block = this.add.rectangle(x, y, width, 30, 0x2e8fff).setOrigin(0.5);
    this.physics.add.existing(block, true);
    this.stack.push(block);
  }

  spawnBlock() {
    const last = this.stack[this.stack.length - 1];
    this.currentBlock = this.add.rectangle(0, last.y - 30, last.width, 30, 0x44ff99).setOrigin(0.5);
    this.physics.add.existing(this.currentBlock);
    this.direction = this.direction * -1;
  }

  dropBlock() {
    if (this.gameOver) return;
    const last = this.stack[this.stack.length - 1];
    const overlap = last.width - Math.abs(this.currentBlock.x - last.x);
    if (overlap <= 0) {
      this.endGame();
      return;
    }
    const newWidth = overlap;
    const newX = (this.currentBlock.x + last.x) / 2;
    this.currentBlock.width = newWidth;
    this.currentBlock.x = newX;
    this.currentBlock.displayWidth = newWidth;
    this.currentBlock.body.setSize(newWidth, 30);
    this.stack.push(this.currentBlock);
    this.score++;
    this.scoreText.setText('Score: ' + this.score);
    this.speed += 0.1;
    this.spawnBlock();
  }

  endGame() {
    this.gameOver = true;
    this.add.text(120, 360, 'Game Over\nClick to Restart', { fontSize: '32px', fill: '#ff4444', align: 'center' });
    this.input.once('pointerdown', () => this.scene.restart(), this);
  }

  update() {
    if (this.gameOver) return;
    if (this.currentBlock) {
      this.currentBlock.x += this.direction * this.speed;
      if (this.currentBlock.x < this.currentBlock.width / 2 || this.currentBlock.x > 480 - this.currentBlock.width / 2) {
        this.direction *= -1;
      }
    }
  }
}
