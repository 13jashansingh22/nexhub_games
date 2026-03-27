import Phaser from 'phaser';

export default class SkyJump extends Phaser.Scene {
  constructor() {
    super('SkyJump');
    this.player = null;
    this.platforms = null;
    this.score = 0;
    this.scoreText = null;
    this.gameOver = false;
    this.jumpVelocity = -500;
    this.cameraYMin = 0;
  }

  preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.platforms = this.physics.add.staticGroup();
    for (let i = 0; i < 10; i++) {
      this.platforms.create(Phaser.Math.Between(60, 420), 720 - i * 80, 'platform').setScale(0.5).refreshBody();
    }
    this.player = this.physics.add.sprite(240, 600, 'player').setScale(1.1);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms, this.jump, null, this);
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    this.gameOver = false;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameraYMin = 600;
  }

  jump(player, platform) {
    if (player.body.touching.down) {
      player.setVelocityY(this.jumpVelocity);
    }
  }

  update() {
    if (this.gameOver) return;
    // Move left/right
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }
    // Camera follows player upward
    if (this.player.y < this.cameraYMin) {
      this.cameras.main.scrollY = this.player.y - 600;
      this.cameraYMin = this.player.y;
      this.score++;
      this.scoreText.setText('Score: ' + this.score);
      // Spawn new platform
      const x = Phaser.Math.Between(60, 420);
      const y = this.player.y - 80;
      this.platforms.create(x, y, 'platform').setScale(0.5).refreshBody();
    }
    // Remove off-screen platforms
    this.platforms.children.iterate(child => {
      if (child && child.y > this.player.y + 800) child.destroy();
    });
    // Game over if fall
    if (this.player.y > this.cameraYMin + 800) {
      this.physics.pause();
      this.gameOver = true;
      this.add.text(120, this.player.y, 'Game Over\nClick to Restart', { fontSize: '32px', fill: '#ff4444', align: 'center' });
      this.input.once('pointerdown', () => this.scene.restart(), this);
    }
  }
}
