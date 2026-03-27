import Phaser from 'phaser';

export default class SubwayEscape extends Phaser.Scene {
  constructor() {
    super('SubwayEscape');
    this.player = null;
    this.lane = 1;
    this.cursors = null;
    this.trains = null;
    this.score = 0;
    this.scoreText = null;
    this.speed = 300;
    this.spawnTimer = 0;
    this.gameOver = false;
    this.distance = 0;
    this.police = null;
    this.policeChase = false;
  }

  preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('train', 'https://labs.phaser.io/assets/sprites/longarrow.png');
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('police', 'https://labs.phaser.io/assets/sprites/robot.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.player = this.physics.add.sprite(240, 600, 'player').setScale(1.2);
    this.player.setCollideWorldBounds(true);
    this.trains = this.physics.add.group();
    this.score = 0;
    this.distance = 0;
    this.lane = 1;
    this.speed = 300;
    this.gameOver = false;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', this.handleSwipe, this);
    this.lastPointer = null;
    this.spawnTimer = 0;
    this.policeChase = false;
    this.police = this.physics.add.sprite(240, 700, 'police').setScale(1.1);
    this.police.setVisible(false);
    this.physics.add.overlap(this.player, this.trains, this.hitTrain, null, this);
  }

  handleSwipe(pointer) {
    if (this.gameOver) return;
    if (!this.lastPointer) {
      this.lastPointer = pointer;
      return;
    }
    const dx = pointer.downX - this.lastPointer.downX;
    if (dx > 30 && this.lane < 2) this.lane++;
    else if (dx < -30 && this.lane > 0) this.lane--;
    this.lastPointer = null;
  }

  spawnTrain() {
    const laneX = [120, 240, 360][Phaser.Math.Between(0, 2)];
    const train = this.trains.create(laneX, -80, 'train');
    train.setVelocityY(this.speed);
    train.setImmovable(true);
    train.setScale(1.2, 0.7);
  }

  hitTrain(player, train) {
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
    this.speed += 0.008;
    // Spawn trains
    this.spawnTimer++;
    if (this.spawnTimer > 50) {
      this.spawnTrain();
      this.spawnTimer = 0;
    }
    // Remove off-screen trains
    this.trains.children.iterate(child => { if (child && child.y > 800) child.destroy(); });
    // Distance
    this.distance += this.speed / 1000;
    this.scoreText.setText('Score: ' + Math.floor(this.distance));
    // Police chase effect
    if (!this.policeChase && this.distance > 100) {
      this.policeChase = true;
      this.police.setVisible(true);
    }
    if (this.policeChase && this.police.y > this.player.y + 80) {
      this.police.y -= 0.5;
    }
  }
}
