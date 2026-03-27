import Phaser from 'phaser';
import { gamesList } from './games/gamesList.js';

const selector = document.getElementById('game-selector');
const container = document.getElementById('game-container');
let currentGame = null;

function clearGame() {
  if (currentGame && currentGame.destroy) {
    currentGame.destroy(true);
    container.innerHTML = '';
  }
}

function renderSelector() {
  selector.innerHTML = '<h1>🎮 Browser Games Platform</h1>';
  gamesList.forEach(game => {
    const btn = document.createElement('button');
    btn.className = 'game-btn';
    btn.textContent = game.title;
    btn.onclick = async () => {
      clearGame();
      const { default: GameScene } = await import(`./games/${game.file}`);
      currentGame = new Phaser.Game({
        type: Phaser.AUTO,
        width: 480,
        height: 720,
        parent: 'game-container',
        scene: GameScene,
        physics: { default: 'arcade', arcade: { debug: false } },
        backgroundColor: '#181c24',
      });
    };
    selector.appendChild(btn);
  });
}

renderSelector();
