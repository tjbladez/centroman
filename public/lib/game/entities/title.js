(function() {
  ig.module('game.entities.title').requires('impact.entity').defines(function() {
    return ig.Title = ig.Entity.extend({
      size: {
        x: GameConfig.main.width,
        y: GameConfig.main.height
      },
      animSheet: new ig.AnimationSheet('media/title.png', GameConfig.main.width, GameConfig.main.height),
      init: function(x, y, opts) {
        this.addAnim("single", 0.5, [1, 0]);
        this.addAnim("multi", 0.5, [3, 2]);
        this.name = "title_screen";
        this.currentAnim = this.anims['single'];
        this.leftkey = opts.leftKey;
        this.rightkey = opts.rightKey;
        return this.parent(x, y, opts);
      },
      update: function() {
        this.parent();
        if (ig.input.pressed(this.leftKey)) {
          this.currentAnim = this.anims['single'];
        }
        if (ig.input.pressed(this.rightKey)) {
          this.currentAnim = this.anims['multi'];
        }
        if (ig.input.pressed('enter') && this.currentAnim === this.anims['multi']) {
          this.kill();
          return ig.game.start();
        }
      }
    });
  });
}).call(this);
