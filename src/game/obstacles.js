window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/obstacles.js',
  exports: ['ObstacleManager'],
  dependencies: []
});

window.ObstacleManager = {
  obstacles: [],

  init() {
    // Create natural obstacles on the field
    this.obstacles = [
      // Trees (circular obstacles represented as rectangles)
      { x: 300, y: 200, width: 40, height: 40, type: 'tree' },
      { x: 500, y: 150, width: 35, height: 35, type: 'tree' },
      { x: 700, y: 250, width: 45, height: 45, type: 'tree' },
      { x: 900, y: 180, width: 38, height: 38, type: 'tree' },
      { x: 400, y: 500, width: 42, height: 42, type: 'tree' },
      { x: 600, y: 550, width: 36, height: 36, type: 'tree' },
      { x: 800, y: 480, width: 40, height: 40, type: 'tree' },
      
      // Rocks (rectangular obstacles)
      { x: 250, y: 350, width: 60, height: 30, type: 'rock' },
      { x: 550, y: 400, width: 50, height: 25, type: 'rock' },
      { x: 850, y: 380, width: 55, height: 28, type: 'rock' },
      { x: 450, y: 300, width: 45, height: 20, type: 'rock' },
      { x: 750, y: 320, width: 48, height: 22, type: 'rock' }
    ];
  },

  getObstacles() {
    return this.obstacles;
  },

  draw(ctx) {
    for (const obstacle of this.obstacles) {
      if (obstacle.type === 'tree') {
        // Draw tree
        ctx.fillStyle = '#228b22';
        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Tree trunk
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(obstacle.x + obstacle.width/2 - 5, obstacle.y + obstacle.height/2, 10, 15);
      } else if (obstacle.type === 'rock') {
        // Draw rock
        ctx.fillStyle = '#696969';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Rock highlight
        ctx.fillStyle = '#808080';
        ctx.fillRect(obstacle.x + 2, obstacle.y + 2, obstacle.width - 4, obstacle.height - 4);
      }
    }
  }
};