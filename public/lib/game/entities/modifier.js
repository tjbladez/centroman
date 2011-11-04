(function() {
  ig.module('game.entities.modifier').requires('impact.entity').defines(function() {
    return ig.Modifier = ig.Entity.extend({
      size: {
        x: GameConfig.map.reducedTileSize,
        y: GameConfig.map.reducedTileSize
      },
      collides: ig.Entity.COLLIDES.NONE,
      type: ig.Entity.TYPE.A,
      init: function(x, y, opts) {
        this.addAnim('idle', 1, [0]);
        this.addAnim('kill', 0.2, [1, 0]);
        return this.parent(x + GameConfig.map.reducedOffset, y + GameConfig.map.reducedOffset, opts);
      },
      isAt: function(x, y) {
        return (this.pos.x - GameConfig.map.reducedOffset === x) && (this.pos.y - GameConfig.map.reducedOffset === y);
      },
      animatedKill: function() {
        this.timer = new ig.Timer(GameConfig.gameplay.killTimer);
        return this.currentAnim = this.anims['kill'];
      },
      kill: function() {
        this.parent();
        return ig.game.removeModifier(this);
      },
      update: function() {
        this.parent();
        if (this.timer && this.timer.delta() > 0) {
          return this.kill();
        }
      }
    });
  });
}).call(this);
