(function() {
  ig.module('game.entities.bomb-powerup').requires('game.entities.modifier').defines(function() {
    return ig.BombPowerup = ig.Modifier.extend({
      animSheet: new ig.AnimationSheet('media/bomb_powerup.png', GameConfig.map.tileSize, GameConfig.map.tileSize),
      checkAgainst: ig.Entity.TYPE.A,
      check: function(other) {
        if (other instanceof ig.EntityPlayer) {
          other.incrementBombCount();
          return this.kill();
        }
      }
    });
  });
}).call(this);
