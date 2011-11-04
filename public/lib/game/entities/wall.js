(function() {
  ig.module('game.entities.wall').requires('impact.entity', 'impact.font', 'impact.timer').defines(function() {
    return ig.EntityWall = ig.Entity.extend({
      size: {
        x: GameConfig.map.tileSize,
        y: GameConfig.map.tileSize
      },
      animSheet: new ig.AnimationSheet('media/wall.png', GameConfig.map.tileSize, GameConfig.map.tileSize),
      collides: ig.Entity.COLLIDES.FIXED,
      type: ig.Entity.TYPE.A,
      init: function(x, y, opts) {
        if (opts.modName) {
          this.modName = opts.modName;
        }
        this.addAnim('idle', 1, [0]);
        this.addAnim('kill', 0.35, [1, 2, 3]);
        return this.parent(x, y, opts);
      },
      isAt: function(x, y) {
        return (this.pos.x === x) && (this.pos.y === y);
      },
      animatedKill: function() {
        this.timer = new ig.Timer(GameConfig.gameplay.killTimer);
        return this.currentAnim = this.anims['kill'];
      },
      kill: function() {
        this.parent();
        ig.game.removeWall(this);
        if (this.modName) {
          return ig.game.spawnModifier({
            name: this.modName,
            x: this.pos.x,
            y: this.pos.y
          });
        }
      },
      update: function() {
        if (this.timer && this.timer.delta() > 0) {
          this.kill();
        }
        return this.parent();
      }
    });
  });
}).call(this);
