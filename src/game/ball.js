window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/ball.js',
  exports: ['Ball'],
  dependencies: ['Vector2D', 'Physics', 'checkRectCollision', 'clamp']
});

window.Ball = class Ball {
  constructor(x, y) {
    this.position = new window.Vector2D(x, y);
    this.velocity = new window.Vector2D(0, 0);
    this.radius = 8;
    this.carrier = null;
  }

  update(deltaTime, obstacles) {
    if (!this.carrier) {
      window.Physics.updatePosition(this, deltaTime);

      // Check collision with obstacles
      if (obstacles && obstacles.length > 0) {
        for (const obstacle of obstacles) {
          if (window.checkRectCollision(this, obstacle)) {
            // Bounce off obstacle
            const centerX = obstacle.x + obstacle.width / 2;
            const centerY = obstacle.y + obstacle.height / 2;
            const bounceDir = new window.Vector2D(this.position.x - centerX, this.position.y - centerY).normalize();
            this.position = new window.Vector2D(centerX, centerY).add(bounceDir.multiply(obstacle.width / 2 + this.radius + 2));
            this.velocity = bounceDir.multiply(this.velocity.magnitude() * 0.8);
          }
        }
      }

      // Keep ball in bounds
      if (this.position.x - this.radius < 0 || this.position.x + this.radius > 1200) {
        this.velocity.x *= -0.8;
        this.position.x = window.clamp(this.position.x, this.radius, 1200 - this.radius);
      }
      if (this.position.y - this.radius < 0 || this.position.y + this.radius > 700) {
        this.velocity.y *= -0.8;
        this.position.y = window.clamp(this.position.y, this.radius, 700 - this.radius);
      }
    }
  }

  draw(ctx) {
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  reset(x, y) {
    this.position = new window.Vector2D(x, y);
    this.velocity = new window.Vector2D(0, 0);
    this.carrier = null;
  }
};