window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/main.js',
  exports: ['Game'],
  dependencies: ['Player', 'Ball', 'ObstacleManager', 'AI', 'Renderer', 'Input', 'Physics']
});

window.Game = {
  players: [],
  ball: null,
  obstacles: [],
  score: { blue: 0, red: 0 },
  controlledPlayer: null,

  init() {
    // Initialize systems
    if (window.Renderer) {
      window.Renderer.init('gameCanvas');
    }
    if (window.Input) {
      window.Input.init();
    }
    if (window.ObstacleManager) {
      window.ObstacleManager.init();
      this.obstacles = window.ObstacleManager.getObstacles();
    }

    // Create ball
    this.ball = new window.Ball(600, 350);

    // Create players
    this.createTeams();

    // Find controlled player
    this.controlledPlayer = this.players.find(p => p.isControlled);

    // Start game loop
    if (window.startGame) {
      window.startGame();
    }
  },

  createTeams() {
    // Blue team (left side, player controls)
    this.players.push(new window.Player(200, 200, 'blue', true));  // Controlled player
    this.players.push(new window.Player(150, 350, 'blue', false));
    this.players.push(new window.Player(200, 500, 'blue', false));
    this.players.push(new window.Player(300, 250, 'blue', false));
    this.players.push(new window.Player(300, 450, 'blue', false));

    // Red team (right side, AI only)
    this.players.push(new window.Player(1000, 200, 'red', false));
    this.players.push(new window.Player(1050, 350, 'red', false));
    this.players.push(new window.Player(1000, 500, 'red', false));
    this.players.push(new window.Player(900, 250, 'red', false));
    this.players.push(new window.Player(900, 450, 'red', false));
  },

  findClosestTeammate(player) {
    if (!player || !this.players) return null;
    
    let closestTeammate = null;
    let closestDistance = Infinity;
    
    for (const teammate of this.players) {
      if (teammate !== player && teammate.team === player.team && !teammate.hasBall) {
        const distance = window.distance(player.position, teammate.position);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestTeammate = teammate;
        }
      }
    }
    
    return closestTeammate;
  },

  handleInput() {
    if (!this.controlledPlayer || !window.Input) return;

    const speed = this.controlledPlayer.speed;
    let moveX = 0;
    let moveY = 0;

    if (window.Input.isKeyDown('ArrowUp')) moveY = -speed;
    if (window.Input.isKeyDown('ArrowDown')) moveY = speed;
    if (window.Input.isKeyDown('ArrowLeft')) moveX = -speed;
    if (window.Input.isKeyDown('ArrowRight')) moveX = speed;

    // Apply movement if any keys are pressed
    if (moveX !== 0 || moveY !== 0) {
      this.controlledPlayer.velocity = new window.Vector2D(moveX, moveY);
    }

    // Pass/kick with spacebar
    if (window.Input.isKeyDown(' ')) {
      if (this.controlledPlayer.hasBall) {
        // Pass to closest teammate
        const closestTeammate = this.findClosestTeammate(this.controlledPlayer);
        if (closestTeammate) {
          const passDirection = closestTeammate.position.subtract(this.controlledPlayer.position).normalize();
          const passSuccess = this.controlledPlayer.kick(this.ball, passDirection);
          // Optional: Add visual feedback for successful pass
        } else {
          // No teammates available, kick forward
          this.controlledPlayer.kick(this.ball, new window.Vector2D(1, 0));
        }
      } else {
        // Tackle/kick when not has ball - kick towards ball direction or forward
        let kickDir;
        if (this.ball && !this.ball.carrier) {
          // Kick towards the ball
          kickDir = this.ball.position.subtract(this.controlledPlayer.position).normalize();
        } else {
          // Default kick direction based on arrow keys or forward
          kickDir = new window.Vector2D(
            window.Input.isKeyDown('ArrowRight') ? 1 : window.Input.isKeyDown('ArrowLeft') ? -1 : (this.controlledPlayer.team === 'blue' ? 1 : -1),
            window.Input.isKeyDown('ArrowDown') ? 1 : window.Input.isKeyDown('ArrowUp') ? -1 : 0
          );
        }
        
        // Ensure we have a valid direction
        if (kickDir.x !== 0 || kickDir.y !== 0) {
          this.controlledPlayer.kick(this.ball, kickDir);
        }
      }
    }
  },

  checkScoring() {
    if (!this.ball) return;

    // Check if ball is in end zones
    if (this.ball.position.x < 100) {
      // Red scores
      this.score.red++;
      this.resetRound();
      this.updateScoreDisplay();
    } else if (this.ball.position.x > 1100) {
      // Blue scores
      this.score.blue++;
      this.resetRound();
      this.updateScoreDisplay();
    }
  },

  resetRound() {
    // Reset ball to center
    if (this.ball) {
      this.ball.reset(600, 350);
    }

    // Reset players to starting positions
    this.players = [];
    this.createTeams();
    this.controlledPlayer = this.players.find(p => p.isControlled);
  },

  updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
      scoreElement.textContent = `Blue: ${this.score.blue} - Red: ${this.score.red}`;
    }
  },

  update(deltaTime) {
    this.handleInput();

    // Update AI players
    if (window.AI && this.players) {
      for (const player of this.players) {
        if (!player.isControlled && this.ball) {
          const aiAction = window.AI.updatePlayer(player, this.ball, this.players, deltaTime);
          if (aiAction && aiAction.shouldKick) {
            player.kick(this.ball, aiAction.kickDirection);
          }
        }
      }
    }

    // Update all players
    if (this.players) {
      for (const player of this.players) {
        player.update(deltaTime, this.ball, this.obstacles, this.players);
      }
    }

    // Update ball
    if (this.ball) {
      this.ball.update(deltaTime, this.obstacles);
    }

    // Check scoring
    this.checkScoring();
  },

  render() {
    if (!window.Renderer) return;

    window.Renderer.clear();
    window.Renderer.drawField();
    
    // Draw obstacles
    if (window.ObstacleManager) {
      window.ObstacleManager.draw(window.Renderer.ctx);
    }

    // Draw players
    if (this.players) {
      for (const player of this.players) {
        player.draw(window.Renderer.ctx);
      }
    }

    // Draw ball
    if (this.ball) {
      this.ball.draw(window.Renderer.ctx);
    }
  }
};

// Global update and render functions for game loop
window.update = function(deltaTime) {
  if (window.Game) {
    window.Game.update(deltaTime);
  }
};

window.render = function() {
  if (window.Game) {
    window.Game.render();
  }
};

// Initialize game when page loads
window.addEventListener('load', () => {
  if (window.Game) {
    window.Game.init();
  }
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    if (window.Game) {
      window.Game.init();
    }
  }, 100);
}