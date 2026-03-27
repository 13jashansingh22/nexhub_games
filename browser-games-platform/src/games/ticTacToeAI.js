import Phaser from 'phaser';

export default class TicTacToeAI extends Phaser.Scene {
  constructor() {
    super('TicTacToeAI');
    this.board = null;
    this.turn = 'X';
    this.gameOver = false;
    this.cells = [];
    this.statusText = null;
  }

  preload() {
    this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
  }

  create() {
    this.add.tileSprite(240, 360, 480, 720, 'bg').setScrollFactor(0);
    this.board = Array(9).fill(null);
    this.turn = 'X';
    this.gameOver = false;
    this.cells = [];
    this.statusText = this.add.text(120, 80, 'Your Turn', { fontSize: '32px', fill: '#e0aaff' });
    for (let i = 0; i < 9; i++) {
      const x = 140 + (i % 3) * 70;
      const y = 220 + Math.floor(i / 3) * 70;
      const cell = this.add.rectangle(x, y, 60, 60, 0x6c1bc6).setStrokeStyle(2, 0xe0aaff);
      cell.setInteractive();
      cell.on('pointerdown', () => this.handleMove(i));
      this.cells.push(cell);
    }
    this.symbols = [];
  }

  handleMove(i) {
    if (this.gameOver || this.board[i]) return;
    this.makeMove(i, 'X');
    if (!this.gameOver) {
      this.time.delayedCall(400, () => this.aiMove(), [], this);
    }
  }

  makeMove(i, symbol) {
    this.board[i] = symbol;
    const x = 140 + (i % 3) * 70;
    const y = 220 + Math.floor(i / 3) * 70;
    const text = this.add.text(x - 18, y - 24, symbol, { fontSize: '48px', fill: symbol === 'X' ? '#fff' : '#b5179e' });
    this.symbols.push(text);
    if (this.checkWin(symbol)) {
      this.statusText.setText(symbol === 'X' ? 'You Win!' : 'AI Wins!');
      this.endGame();
    } else if (this.board.every(cell => cell)) {
      this.statusText.setText('Draw!');
      this.endGame();
    } else {
      this.statusText.setText(symbol === 'X' ? 'AI Turn' : 'Your Turn');
    }
  }

  aiMove() {
    const move = this.minimax(this.board, 'O').index;
    if (move !== undefined) this.makeMove(move, 'O');
  }

  minimax(newBoard, player) {
    const availSpots = newBoard.map((v, i) => v ? null : i).filter(v => v !== null);
    if (this.checkWin('X', newBoard)) return { score: -10 };
    if (this.checkWin('O', newBoard)) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };
    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      const idx = availSpots[i];
      const move = { index: idx };
      newBoard[idx] = player;
      const result = this.minimax(newBoard, player === 'O' ? 'X' : 'O');
      move.score = result.score;
      newBoard[idx] = null;
      moves.push(move);
    }
    let bestMove;
    if (player === 'O') {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }

  checkWin(symbol, board = this.board) {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return wins.some(line => line.every(i => board[i] === symbol));
  }

  endGame() {
    this.gameOver = true;
    this.input.once('pointerdown', () => this.scene.restart(), this);
  }
}
