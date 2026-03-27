import Phaser from 'phaser';

export default class SpaceShooter extends Phaser.Scene {
  constructor() {
    super('SpaceShooter');
    this.player = null;
    this.cursors = null;
    this.bullets = null;
    this.enemies = null;
    this.enemyBullets = null;
    this.score = 0;
    this.scoreText = null;
    this.gameOver = false;
    this.boss = null;
    this.level = 1;
    this.bossActive = false;
  }

  preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/space-baddie.png');
    this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullets/bullet11.png');
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/space-baddie.png');
    this.load.image('enemyBullet', 'https://labs.phaser.io/assets/sprites/bullets/bullet02.png');
    this.load.image('boss', 'https://labs.phaser.io/assets/sprites/ufo.png');
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.player = this.physics.add.sprite(240, 650, 'player').setScale(1.2);
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.score = 0;
    this.level = 1;
    this.bossActive = false;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    this.input.keyboard.on('keydown-SPACE', this.shoot, this);
    this.spawnTimer = 0;
    this.boss = null;
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
    this.physics.add.overlap(this.player, this.enemyBullets, this.hitPlayer, null, this);
    this.physics.add.overlap(this.bullets, this.boss, this.hitBoss, null, this);
  }

  shoot() {
    if (this.gameOver) return;
    const bullet = this.bullets.create(this.player.x, this.player.y - 30, 'bullet');
    bullet.setVelocityY(-400);
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(40, 440);
    const enemy = this.enemies.create(x, -40, 'enemy');
    enemy.setVelocityY(100 + this.level * 10);
    if (Phaser.Math.Between(0, 10) < 2) {
      this.time.delayedCall(Phaser.Math.Between(500, 2000), () => {
        if (enemy.active) this.enemyShoot(enemy.x, enemy.y);
      });
    }
  }

  enemyShoot(x, y) {
    const bullet = this.enemyBullets.create(x, y, 'enemyBullet');
    bullet.setVelocityY(200 + this.level * 10);
  }

  spawnBoss() {
    this.boss = this.physics.add.sprite(240, 100, 'boss').setScale(2);
    this.boss.hp = 20 + this.level * 5;
    this.bossActive = true;
    this.boss.setVelocityX(100);
  }

  hitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
  }

  hitBoss(bullet, boss) {
    bullet.destroy();
    boss.hp--;
    if (boss.hp <= 0) {
      boss.destroy();
      this.score += 100;
      this.scoreText.setText('Score: ' + this.score);
      this.level++;
      this.bossActive = false;
    }
  }

  hitPlayer(player, obj) {
    this.physics.pause();
    this.gameOver = true;
    this.add.text(120, 360, 'Game Over\nClick to Restart', { fontSize: '32px', fill: '#ff4444', align: 'center' });
    this.input.once('pointerdown', () => this.scene.restart(), this);
  }

  update() {
    if (this.gameOver) return;
    // Move player
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
    } else {
      this.player.setVelocityX(0);
    }
    // Spawn enemies
    this.spawnTimer++;
    if (!this.bossActive && this.spawnTimer > 40) {
      this.spawnEnemy();
      this.spawnTimer = 0;
    }
    // Remove off-screen
    this.bullets.children.iterate(child => { if (child && child.y < -40) child.destroy(); });
    this.enemies.children.iterate(child => { if (child && child.y > 800) child.destroy(); });
    this.enemyBullets.children.iterate(child => { if (child && child.y > 800) child.destroy(); });
    // Boss
    if (!this.bossActive && this.score > 100 * this.level) {
      this.spawnBoss();
    }
    if (this.bossActive && this.boss) {
      if (this.boss.x < 60 || this.boss.x > 420) this.boss.setVelocityX(-this.boss.body.velocity.x);
      if (Phaser.Math.Between(0, 100) < 2) this.enemyShoot(this.boss.x, this.boss.y + 40);
    }
  }
}
