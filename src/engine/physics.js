window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/engine/physics.js',
  exports: ['Physics', 'checkCircleCollision', 'checkRectCollision'],
  dependencies: ['Vector2D', 'distance']
});

window.Physics = {
  gravity: 0,
  friction: 0.95,
  
  updatePosition(entity, deltaTime) {
    if (entity.velocity) {
      entity.position = entity.position.add(entity.velocity.multiply(deltaTime / 16));
      entity.velocity = entity.velocity.multiply(this.friction);
      
      // Stop very slow movement
      if (entity.velocity.magnitude() < 0.1) {
        entity.velocity = new window.Vector2D(0, 0);
      }
    }
  },

  applyForce(entity, force) {
    if (entity.velocity) {
      entity.velocity = entity.velocity.add(force);
    }
  }
};

window.checkCircleCollision = function(obj1, obj2) {
  const dist = window.distance(obj1.position, obj2.position);
  return dist < (obj1.radius + obj2.radius);
};

window.checkRectCollision = function(circle, rect) {
  const closestX = Math.max(rect.x, Math.min(circle.position.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.position.y, rect.y + rect.height));
  
  const distX = circle.position.x - closestX;
  const distY = circle.position.y - closestY;
  
  return (distX * distX + distY * distY) < (circle.radius * circle.radius);
};