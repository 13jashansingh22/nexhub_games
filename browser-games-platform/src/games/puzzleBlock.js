import Phaser from 'phaser';

export default class PuzzleBlock extends Phaser.Scene {
  constructor() {
    super('PuzzleBlock');
    this.board = [];
    this.current = null;
    this.score = 0;
    this.scoreText = null;
    this.gameOver = false;
    this.dropTimer = 0;
    this.speed = 30;
  }

  preload() {
    this.load.image('block', 'https://labs.phaser.io/assets/sprites/block.png');
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.board = Array.from({ length: 20 }, () => Array(10).fill(0));
    this.score = 0;
    this.speed = 30;
    this.gameOver = false;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    this.spawnBlock();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.dropTimer = 0;
  }

  spawnBlock() {
    this.current = {
      x: 4,
      y: 0,
      shape: [[1,1,1,1]],
      color: 0x6c1bc6
    };
  }

  move(dx) {
    this.current.x += dx;
    if (this.collides()) this.current.x -= dx;
  }

  rotate() {
    this.current.shape = this.current.shape[0].map((_, i) => this.current.shape.map(row => row[i]).reverse());
    if (this.collides()) this.current.shape = this.current.shape[0].map((_, i) => this.current.shape.map(row => row[i]));
  }

  collides() {
    for (let y = 0; y < this.current.shape.length; y++) {
      for (let x = 0; x < this.current.shape[y].length; x++) {
        if (this.current.shape[y][x]) {
          const bx = this.current.x + x;
          const by = this.current.y + y;
          if (bx < 0 || bx >= 10 || by >= 20 || (by >= 0 && this.board[by][bx])) return true;
        }
      }
    }
    return false;
  }

  merge() {
    for (let y = 0; y < this.current.shape.length; y++) {
      for (let x = 0; x < this.current.shape[y].length; x++) {
        if (this.current.shape[y][x]) {
          const bx = this.current.x + x;
          const by = this.current.y + y;
          if (by >= 0) this.board[by][bx] = this.current.color;
        }
      }
    }
  }

  clearLines() {
    let lines = 0;
    for (let y = 19; y >= 0; y--) {
      if (this.board[y].every(cell => cell)) {
        this.board.splice(y, 1);
        this.board.unshift(Array(10).fill(0));
        lines++;
        y++;
      }
    }
    this.score += lines * 100;
    this.scoreText.setText('Score: ' + this.score);
  }

  update() {
    if (this.gameOver) return;
    this.dropTimer++;
    if (this.dropTimer > this.speed) {
      this.current.y++;
      if (this.collides()) {
        this.current.y--;
        this.merge();
        this.clearLines();
        this.spawnBlock();
        if (this.collides()) {
          this.endGame();
          return;
        }
      }
      this.dropTimer = 0;
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) this.move(-1);
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) this.move(1);
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) this.rotate();
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) this.speed = 5;
    else this.speed = 30;
    this.drawBoard();
  }

  drawBoard() {
    this.children.list.filter(c => c.type === 'Graphics').forEach(c => c.destroy());
    const g = this.add.graphics();
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        if (this.board[y][x]) {
          g.fillStyle(this.board[y][x], 1);
          g.fillRect(80 + x * 24, 120 + y * 24, 22, 22);
        }
      }
    }
    for (let y = 0; y < this.current.shape.length; y++) {
      for (let x = 0; x < this.current.shape[y].length; x++) {
        if (this.current.shape[y][x]) {
          g.fillStyle(this.current.color, 1);
          g.fillRect(80 + (this.current.x + x) * 24, 120 + (this.current.y + y) * 24, 22, 22);
        }
      }
    }
  }

  endGame() {
    this.gameOver = true;
    this.add.text(120, 360, 'Game Over\nClick to Restart', { fontSize: '32px', fill: '#ff4444', align: 'center' });
    this.input.once('pointerdown', () => this.scene.restart(), this);
  }
}
