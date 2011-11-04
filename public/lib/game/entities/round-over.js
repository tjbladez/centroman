(function() {
  ig.module('game.entities.round-over').requires('impact.entity').defines(function() {
    return ig.RoundOver = ig.Entity.extend({
      size: {
        x: GameConfig.main.width,
        y: GameConfig.main.height
      },
      animSheet: new ig.AnimationSheet('media/roundover.png', GameConfig.main.width, GameConfig.main.height),
      init: function(x, y, opts) {
        this.name = "round_over";
        this.addAnim("draw_death", 0.5, [0, 1]);
        this.addAnim("draw_time", 0.5, [2, 5]);
        this.addAnim("player1", 0.5, [3, 4]);
        this.addAnim("player2", 0.5, [6, 7]);
        return this.parent(x, y, opts);
      },
      draw: function() {
        var players;
        players = ig.game.getEntitiesByType(ig.EntityPlayer);
        if (players.length === 0) {
          this.currentAnim = this.anims['draw_death'];
        }
        if (players.length === 1) {
          this.currentAnim = this.anims[players[0].name];
        }
        if (players.length === 2) {
          this.currentAnim = this.anims['draw_time'];
        }
        return this.parent();
      },
      update: function() {
        this.parent();
        if (ig.input.pressed('enter')) {
          this.kill();
          return ig.game.restart();
        }
      }
    });
  });
}).call(this);
