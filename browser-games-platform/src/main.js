import Phaser from 'phaser';
import { gamesList } from './games/gamesList.js';

const selector = document.getElementById('game-selector');
const container = document.getElementById('game-container');
let currentGame = null;
const gameModules = import.meta.glob('./games/*.js');

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
      try {
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
      } catch (error) {
        console.error(`Failed to load game "${game.title}"`, error);
        container.innerHTML =
          '<p style="color:#fff;text-align:center;padding:20px;">Failed to load this game. Please try another one.</p>';
      }
    };
    selector.appendChild(btn);
  });
}

renderSelector();
