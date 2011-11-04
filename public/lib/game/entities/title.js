(function() {
  ig.module('game.entities.title').requires('impact.entity').defines(function() {
    return ig.Title = ig.Entity.extend({
      size: {
        x: GameConfig.main.width,
        y: GameConfig.main.height
      },
      animSheet: new ig.AnimationSheet('media/title.png', GameConfig.main.width, GameConfig.main.height),
      init: function(x, y, opts) {
        this.addAnim("idle", 0.5, [1, 0]);
        this.name = "title_screen";
        return this.parent(x, y, opts);
      },
      update: function() {
        this.parent();
        if (ig.input.pressed('enter')) {
          this.kill();
          return ig.game.start();
        }
      }
    });
  });
}).call(this);
