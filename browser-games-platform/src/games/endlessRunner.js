import Phaser from 'phaser';

export default class EndlessRunner extends Phaser.Scene {
  constructor() {
    super('EndlessRunner');
    this.player = null;
    this.cursors = null;
    this.obstacles = null;
    this.coins = null;
    this.score = 0;
    this.scoreText = null;
    this.gameOver = false;
    this.speed = 300;
    this.lane = 1; // 0: left, 1: center, 2: right
    this.powerUps = null;
    this.magnetActive = false;
    this.shieldActive = false;
    this.distance = 0;
    this.magnetTimer = 0;
    this.shieldTimer = 0;
  }

  preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('obstacle', 'https://labs.phaser.io/assets/sprites/asteroid.png');
    this.load.image('coin', 'https://labs.phaser.io/assets/sprites/gold_1.png');
    this.load.image('magnet', 'https://labs.phaser.io/assets/sprites/magnet.png');
    this.load.image('shield', 'https://labs.phaser.io/assets/sprites/shield.png');
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.player = this.physics.add.sprite(240, 600, 'player').setScale(1.2);
    this.player.setCollideWorldBounds(true);
    this.obstacles = this.physics.add.group();
    this.coins = this.physics.add.group();
    this.powerUps = this.physics.add.group();
    this.score = 0;
    this.distance = 0;
    this.gameOver = false;
    this.speed = 300;
    this.lane = 1;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', this.handleSwipe, this);
    this.lastPointer = null;
    this.spawnTimer = 0;
    this.coinTimer = 0;
    this.powerUpTimer = 0;
    this.magnetActive = false;
    this.shieldActive = false;
    this.magnetTimer = 0;
    this.shieldTimer = 0;
    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);
  }

  handleSwipe(pointer) {
    if (this.gameOver) return;
    if (!this.lastPointer) {
      this.lastPointer = pointer;
      return;
    }
    const dx = pointer.downX - this.lastPointer.downX;
    const dy = pointer.downY - this.lastPointer.downY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30 && this.lane < 2) this.lane++;
      else if (dx < -30 && this.lane > 0) this.lane--;
    } else {
      if (dy < -30) this.jump();
      else if (dy > 30) this.slide();
    }
    this.lastPointer = null;
  }

  jump() {
    if (this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }
  }

  slide() {
    // Slide effect: shrink player for a short time
    this.player.setScale(1.2, 0.6);
    this.time.delayedCall(400, () => this.player.setScale(1.2, 1.2));
  }

  spawnObstacle() {
    const laneX = [120, 240, 360][Phaser.Math.Between(0, 2)];
    const obs = this.obstacles.create(laneX, -50, 'obstacle');
    obs.setVelocityY(this.speed);
    obs.setImmovable(true);
  }

  spawnCoin() {
    const laneX = [120, 240, 360][Phaser.Math.Between(0, 2)];
    const coin = this.coins.create(laneX, -50, 'coin');
    coin.setVelocityY(this.speed);
  }

  spawnPowerUp() {
    const laneX = [120, 240, 360][Phaser.Math.Between(0, 2)];
    const type = Phaser.Math.Between(0, 1) ? 'magnet' : 'shield';
    const power = this.powerUps.create(laneX, -50, type);
    power.setData('type', type);
    power.setVelocityY(this.speed);
  }

  collectCoin(player, coin) {
    coin.destroy();
    this.score += 10;
    this.scoreText.setText('Score: ' + (this.score + Math.floor(this.distance)));
  }

  collectPowerUp(player, power) {
    const type = power.getData('type');
    power.destroy();
    if (type === 'magnet') {
      this.magnetActive = true;
      this.magnetTimer = 400;
    } else if (type === 'shield') {
      this.shieldActive = true;
      this.shieldTimer = 400;
      this.player.setTint(0x00ffcc);
    }
  }

  hitObstacle(player, obs) {
    if (this.shieldActive) {
      obs.destroy();
      this.shieldActive = false;
      this.player.clearTint();
      return;
    }
    this.physics.pause();
    this.gameOver = true;
    this.add.text(120, 360, 'Game Over\nClick to Restart', { fontSize: '32px', fill: '#ff4444', align: 'center' });
    this.input.once('pointerdown', () => this.scene.restart(), this);
  }

  update() {
    if (this.gameOver) return;
    // Move player to lane
    const targetX = [120, 240, 360][this.lane];
    this.player.x += (targetX - this.player.x) * 0.2;
    // Increase speed
    this.speed += 0.01;
    // Spawn obstacles
    this.spawnTimer++;
    if (this.spawnTimer > 40) {
      this.spawnObstacle();
      this.spawnTimer = 0;
    }
    // Spawn coins
    this.coinTimer++;
    if (this.coinTimer > 30) {
      this.spawnCoin();
      this.coinTimer = 0;
    }
    // Spawn power-ups
    this.powerUpTimer++;
    if (this.powerUpTimer > 400) {
      this.spawnPowerUp();
      this.powerUpTimer = 0;
    }
    // Remove off-screen objects
    this.obstacles.children.iterate(child => { if (child && child.y > 800) child.destroy(); });
    this.coins.children.iterate(child => { if (child && child.y > 800) child.destroy(); });
    this.powerUps.children.iterate(child => { if (child && child.y > 800) child.destroy(); });
    // Magnet effect
    if (this.magnetActive) {
      this.coins.children.iterate(coin => {
        if (coin && Phaser.Math.Distance.Between(this.player.x, this.player.y, coin.x, coin.y) < 150) {
          this.physics.moveToObject(coin, this.player, 600);
        }
      });
      this.magnetTimer--;
      if (this.magnetTimer <= 0) this.magnetActive = false;
    }
    // Shield timer
    if (this.shieldActive) {
      this.shieldTimer--;
      if (this.shieldTimer <= 0) {
        this.shieldActive = false;
        this.player.clearTint();
      }
    }
    // Distance
    this.distance += this.speed / 1000;
    this.scoreText.setText('Score: ' + (this.score + Math.floor(this.distance)));
  }
}
