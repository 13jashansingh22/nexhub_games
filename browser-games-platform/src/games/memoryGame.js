import Phaser from 'phaser';

export default class MemoryGame extends Phaser.Scene {
  constructor() {
    super('MemoryGame');
    this.cards = [];
    this.flipped = [];
    this.score = 0;
    this.scoreText = null;
    this.timer = 60;
    this.timerText = null;
    this.gameOver = false;
  }

  preload() {
    this.load.image('card', 'https://labs.phaser.io/assets/sprites/card.png');
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.cards = [];
    this.flipped = [];
    this.score = 0;
    this.timer = 60;
    this.gameOver = false;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    this.timerText = this.add.text(340, 16, 'Time: 60', { fontSize: '24px', fill: '#fff' });
    const values = Phaser.Utils.Array.Shuffle([...Array(8).keys(), ...Array(8).keys()]);
    for (let i = 0; i < 16; i++) {
      const x = 100 + (i % 4) * 70;
      const y = 200 + Math.floor(i / 4) * 90;
      const card = this.add.rectangle(x, y, 60, 80, 0x6c1bc6).setStrokeStyle(2, 0xe0aaff);
      card.value = values[i];
      card.flipped = false;
      card.setInteractive();
      card.on('pointerdown', () => this.flipCard(card));
      this.cards.push(card);
    }
    this.time.addEvent({ delay: 1000, callback: this.tick, callbackScope: this, loop: true });
  }

  flipCard(card) {
    if (this.gameOver || card.flipped || this.flipped.length === 2) return;
    card.setFillStyle(0xe0aaff);
    card.flipped = true;
    this.flipped.push(card);
    if (this.flipped.length === 2) {
      this.time.delayedCall(600, this.checkMatch, [], this);
    }
  }

  checkMatch() {
    const [a, b] = this.flipped;
    if (a.value === b.value) {
      this.score += 10;
      this.scoreText.setText('Score: ' + this.score);
      a.setVisible(false);
      b.setVisible(false);
    } else {
      a.setFillStyle(0x6c1bc6);
      b.setFillStyle(0x6c1bc6);
      a.flipped = false;
      b.flipped = false;
    }
    this.flipped = [];
    if (this.cards.every(card => !card.visible)) {
      this.endGame();
    }
  }

  tick() {
    if (this.gameOver) return;
    this.timer--;
    this.timerText.setText('Time: ' + this.timer);
    if (this.timer <= 0) {
      this.endGame();
    }
  }

  endGame() {
    this.gameOver = true;
    this.add.text(120, 360, 'Game Over\nClick to Restart', { fontSize: '32px', fill: '#ff4444', align: 'center' });
    this.input.once('pointerdown', () => this.scene.restart(), this);
  }
}
