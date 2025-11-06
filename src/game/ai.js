window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/ai.js',
  exports: ['AI'],
  dependencies: ['Vector2D', 'distance']
});

window.AI = {
  updatePlayer(player, ball, allPlayers, deltaTime) {
    if (player.isControlled || player.hasBall) return;

    const distToBall = window.distance(player.position, ball.position);
    const teamGoal = player.team === 'blue' ? { x: 1100, y: 350 } : { x: 100, y: 350 };
    const distToGoal = window.distance(player.position, teamGoal);

    // AI behavior based on situation
    let targetPos = player.position;
    let shouldKick = false;
    let kickDirection = new window.Vector2D(0, 0);

    if (distToBall < 200 && !ball.carrier) {
      // Chase the ball
      targetPos = ball.position;
    } else if (player.team === 'blue') {
      // Blue team - offensive
      if (ball.carrier && ball.carrier.team === 'blue') {
        // Support ball carrier
        targetPos = ball.position.add(new window.Vector2D(50, 0));
      } else {
        // Move towards offensive position
        targetPos = new window.Vector2D(Math.min(ball.position.x + 100, 900), ball.position.y);
      }
    } else {
      // Red team - defensive
      if (ball.carrier && ball.carrier.team === 'red') {
        // Support ball carrier
        targetPos = ball.position.add(new window.Vector2D(-50, 0));
      } else {
        // Defensive position
        targetPos = new window.Vector2D(Math.max(ball.position.x - 100, 300), ball.position.y);
      }
    }

    // Move towards target
    const direction = targetPos.subtract(player.position).normalize();
    player.velocity = direction.multiply(player.speed);

    // Try to kick ball if close
    if (distToBall < 30 && !ball.carrier) {
      kickDirection = player.team === 'blue' ? 
        new window.Vector2D(1, 0) : // Kick towards red goal
        new window.Vector2D(-1, 0); // Kick towards blue goal
      shouldKick = true;
    }

    return { shouldKick, kickDirection };
  }
};