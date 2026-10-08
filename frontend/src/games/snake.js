// Snake Game Logic
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game settings
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        this.initialSpeed = 100;
        this.speed = this.initialSpeed;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        
        // Snake
        this.snake = [
            { x: 10, y: 10 }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        // Food
        this.food = this.generateFood();
        
        // Game loop
        this.gameLoopId = null;
        this.lastMoveTime = 0;
        
        // Initialize UI
        this.updateScore();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Button controls
        const startBtn = document.getElementById('startBtn');
        const startBtn2 = document.getElementById('startBtn2');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        startBtn.addEventListener('click', () => this.start());
        startBtn2.addEventListener('click', () => this.start());
        pauseBtn.addEventListener('click', () => this.togglePause());
        resetBtn.addEventListener('click', () => this.reset());
    }

    handleKeyPress(e) {
        if (!this.gameRunning || this.gameOver) return;

        const key = e.key.toLowerCase();
        
        // Arrow keys
        if (key === 'arrowup' && this.direction.y === 0) {
            this.nextDirection = { x: 0, y: -1 };
            e.preventDefault();
        } else if (key === 'arrowdown' && this.direction.y === 0) {
            this.nextDirection = { x: 0, y: 1 };
            e.preventDefault();
        } else if (key === 'arrowleft' && this.direction.x === 0) {
            this.nextDirection = { x: -1, y: 0 };
            e.preventDefault();
        } else if (key === 'arrowright' && this.direction.x === 0) {
            this.nextDirection = { x: 1, y: 0 };
            e.preventDefault();
        }
        
        // Space to pause
        if (key === ' ') {
            this.togglePause();
            e.preventDefault();
        }
    }

    start() {
        if (this.gameRunning && !this.gameOver) return;
        
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameOver = false;
        this.hideGameOverlay();
        this.updateButtonStates();
        
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }
        
        this.gameLoop();
    }

    togglePause() {
        if (!this.gameRunning || this.gameOver) return;
        
        this.gamePaused = !this.gamePaused;
        this.updateButtonStates();
        
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }

    reset() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.score = 0;
        this.speed = this.initialSpeed;
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = this.generateFood();
        this.hideGameOverlay();
        this.updateScore();
        this.updateButtonStates();
        this.draw();
    }

    gameLoop() {
        if (this.gamePaused) return;
        
        const now = Date.now();
        const deltaTime = now - this.lastMoveTime;
        
        if (deltaTime >= this.speed) {
            this.update();
            this.draw();
            this.lastMoveTime = now;
        }
        
        if (this.gameRunning && !this.gameOver) {
            this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
        }
    }

    update() {
        // Update direction
        this.direction = this.nextDirection;
        
        // Calculate new head position
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };
        
        // Check wall collision
        if (this.checkWallCollision(newHead)) {
            this.endGame();
            return;
        }
        
        // Check self collision
        if (this.checkSelfCollision(newHead)) {
            this.endGame();
            return;
        }
        
        // Add new head
        this.snake.unshift(newHead);
        
        // Check food collision
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
            
            // Increase speed slightly
            this.speed = Math.max(50, this.initialSpeed - Math.floor(this.score / 50) * 5);
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid (optional)
        this.drawGrid();
        
        // Draw snake
        this.drawSnake();
        
        // Draw food
        this.drawFood();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= this.tileCount; i++) {
            const pos = i * this.gridSize;
            
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            
            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
    }

    drawSnake() {
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#00ff00';
                this.ctx.shadowColor = '#00ff00';
                this.ctx.shadowBlur = 10;
            } else {
                // Body
                this.ctx.fillStyle = '#00cc00';
                this.ctx.shadowColor = 'transparent';
            }
            
            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;
            
            this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
        });
        
        this.ctx.shadowColor = 'transparent';
    }

    drawFood() {
        this.ctx.fillStyle = '#ff0000';
        this.ctx.shadowColor = '#ff0000';
        this.ctx.shadowBlur = 10;
        
        const x = this.food.x * this.gridSize;
        const y = this.food.y * this.gridSize;
        
        // Draw circle for food
        this.ctx.beginPath();
        this.ctx.arc(
            x + this.gridSize / 2,
            y + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        this.ctx.shadowColor = 'transparent';
    }

    generateFood() {
        let food;
        let isOnSnake = true;
        
        while (isOnSnake) {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            
            isOnSnake = this.snake.some(segment => 
                segment.x === food.x && segment.y === food.y
            );
        }
        
        return food;
    }

    checkWallCollision(head) {
        return head.x < 0 || 
               head.x >= this.tileCount || 
               head.y < 0 || 
               head.y >= this.tileCount;
    }

    checkSelfCollision(head) {
        return this.snake.some(segment => 
            segment.x === head.x && segment.y === head.y
        );
    }

    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateScore();
        }
        
        this.showGameOverlay();
        this.updateButtonStates();
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
    }

    showGameOverlay() {
        const overlay = document.getElementById('gameOverlay');
        const finalScore = document.getElementById('finalScore');
        finalScore.textContent = this.score;
        overlay.classList.add('active');
    }

    hideGameOverlay() {
        const overlay = document.getElementById('gameOverlay');
        overlay.classList.remove('active');
    }

    updateButtonStates() {
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (this.gamePaused) {
            pauseBtn.textContent = 'Resume';
            pauseBtn.classList.add('paused');
        } else {
            pauseBtn.textContent = 'Pause';
            pauseBtn.classList.remove('paused');
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeGame();
    game.draw();
});
