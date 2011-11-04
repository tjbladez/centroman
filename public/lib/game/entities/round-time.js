(function() {
  ig.module('game.entities.round-time').requires('impact.entity', 'impact.font').defines(function() {
    return ig.RoundTime = ig.Entity.extend({
      font: new ig.Font('media/font-48_orange.png'),
      init: function(x, y, opts) {
        this.countdown = GameConfig.gameplay.roundTime;
        return this.parent(x, y, opts);
      },
      draw: function() {
        this.font.draw("" + this.minutes + ":" + this.seconds, 324, 1);
        return this.parent();
      },
      update: function() {
        var ticks;
        this.parent();
        ticks = Math.floor(this.countdown / 60);
        this.minutes = Math.floor(ticks / 60);
        this.seconds = ticks % 60;
        if (this.seconds < 10) {
          this.seconds = "0" + this.seconds;
        }
        this.countdown -= 1;
        if (this.countdown === 0) {
          ig.game.stopRound();
          return this.kill();
        }
      }
    });
  });
}).call(this);
