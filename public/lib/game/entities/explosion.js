(function() {
  ig.module('game.entities.explosion').requires('impact.entity').defines(function() {
    return ig.EntityExplosion = ig.Entity.extend({
      size: {
        x: GameConfig.map.reducedTileSize,
        y: GameConfig.map.reducedTileSize
      },
      collides: ig.Entity.COLLIDES.NONE,
      animSheet: new ig.AnimationSheet('media/explosion.png', GameConfig.map.tileSize, GameConfig.map.tileSize),
      type: ig.Entity.TYPE.B,
      checkAgainst: ig.Entity.TYPE.A,
      init: function(x, y, opts) {
        this.owner = opts.owner;
        this.duration = GameConfig.gameplay.explosionDuration;
        this.addAnim('idle', 0.05, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        return this.parent(x + GameConfig.map.reducedOffset, y + GameConfig.map.reducedOffset, opts);
      },
      update: function() {
        this.parent();
        if (this.duration > 0) {
          return this.duration -= 1;
        } else {
          return this.kill();
        }
      },
      check: function(other) {
        return other.receiveDamage(this);
      }
    });
  });
}).call(this);
