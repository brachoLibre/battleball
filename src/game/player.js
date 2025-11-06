window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/player.js',
  exports: ['Player'],
  dependencies: ['Vector2D', 'Physics', 'checkCircleCollision', 'checkRectCollision', 'clamp']
});

window.Player = class Player {
  constructor(x, y, team, isControlled = false) {
    this.position = new window.Vector2D(x, y);
    this.velocity = new window.Vector2D(0, 0);
    this.team = team; // 'blue' or 'red'
    this.radius = 15;
    this.speed = isControlled ? 4 : 2.5;
    this.isControlled = isControlled;
    this.hasBall = false;
    this.kickCooldown = 0;
  }

  update(deltaTime, ball, obstacles, allPlayers) {
    // Update kick cooldown
    if (this.kickCooldown > 0) {
      this.kickCooldown -= deltaTime;
    }

    // Check collision with obstacles
    if (obstacles && obstacles.length > 0) {
      for (const obstacle of obstacles) {
        if (window.checkRectCollision(this, obstacle)) {
          // Push player away from obstacle and slide along it
          const centerX = obstacle.x + obstacle.width / 2;
          const centerY = obstacle.y + obstacle.height / 2;
          const pushDir = new window.Vector2D(this.position.x - centerX, this.position.y - centerY).normalize();
          this.position = new window.Vector2D(centerX, centerY).add(pushDir.multiply(obstacle.width / 2 + this.radius + 2));
          
          // Slide along obstacle instead of stopping completely
          const normal = pushDir;
          const dotProduct = this.velocity.x * normal.x + this.velocity.y * normal.y;
          this.velocity.x -= 2 * dotProduct * normal.x * 0.5; // Bounce with damping
          this.velocity.y -= 2 * dotProduct * normal.y * 0.5;
        }
      }
    }

    // Check collision with other players
    if (allPlayers && allPlayers.length > 0) {
      for (const other of allPlayers) {
        if (other !== this && window.checkCircleCollision(this, other)) {
          const pushDir = this.position.subtract(other.position).normalize();
          this.position = other.position.add(pushDir.multiply(this.radius + other.radius + 1));
          
          // Exchange velocities with damping instead of stopping
          const relativeVel = this.velocity.subtract(other.velocity);
          const impulse = pushDir.multiply(relativeVel.x * pushDir.x + relativeVel.y * pushDir.y);
          this.velocity = this.velocity.subtract(impulse.multiply(0.5));
        }
      }
    }

    window.Physics.updatePosition(this, deltaTime);

    // Keep player in bounds
    this.position.x = window.clamp(this.position.x, this.radius, 1200 - this.radius);
    this.position.y = window.clamp(this.position.y, this.radius, 700 - this.radius);

    // Ball interaction
    if (ball) {
      if (this.hasBall) {
        ball.position.x = this.position.x;
        ball.position.y = this.position.y;
        ball.velocity = new window.Vector2D(0, 0);
      } else if (window.checkCircleCollision(this, ball)) {
        // Try to pick up ball
        if (!ball.carrier && this.kickCooldown <= 0) {
          this.hasBall = true;
          ball.carrier = this;
        }
      }
    }
  }

  kick(ball, direction) {
    if (this.kickCooldown > 0 || !ball) return false;

    if (this.hasBall) {
      this.hasBall = false;
      ball.carrier = null;
      const kickForce = direction.normalize().multiply(15);
      ball.velocity = kickForce;
      this.kickCooldown = 500;
      return true;
    }
    
    // Try to kick loose ball
    if (!ball.carrier) {
      const distToBall = window.distance(this.position, ball.position);
      if (distToBall < 50) { // Within kicking range
        const kickForce = direction.normalize().multiply(10);
        ball.velocity = kickForce;
        this.kickCooldown = 300;
        return true;
      }
    }
    
    return false;
  }

  draw(ctx) {
    if (!ctx) return;

    // Draw player
    ctx.fillStyle = this.team === 'blue' ? '#4169e1' : '#dc143c';
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw indicator for controlled player
    if (this.isControlled) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw ball indicator
    if (this.hasBall) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y - 20, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};