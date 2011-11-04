(function() {
  ig.module('game.entities.player').requires('impact.entity', 'impact.font', 'game.entities.bomb').defines(function() {
    return ig.EntityPlayer = ig.Entity.extend({
      size: {
        x: GameConfig.map.tileSize,
        y: GameConfig.map.tileSize
      },
      collides: ig.Entity.COLLIDES.PASSIVE,
      type: ig.Entity.TYPE.A,
      font: new ig.Font('media/font-24_orange.png'),
      bombs: [],
      init: function(x, y, opts) {
        this.maxVel.x = GameConfig.gameplay.maxVel;
        this.maxVel.y = GameConfig.gameplay.maxVel;
        this.name = opts.name;
        this.facing = opts.facing;
        this.hudX = opts.hudX;
        this.hudY = opts.hudY;
        this.animSheet = new ig.AnimationSheet("media/" + this.name + ".png", this.size.x, this.size.y);
        this.bombRange = GameConfig.gameplay.bombRange;
        this.bombCount = GameConfig.gameplay.bombCount;
        this.bombHud = new ig.Image('media/bomb_24.png');
        this.rangeHud = new ig.Image('media/explosion_24.png');
        this.addAnim('idleleft', 1, [4]);
        this.addAnim('idleup', 1, [9]);
        this.addAnim('idleright', 1, [14]);
        this.addAnim('idledown', 1, [19]);
        this.addAnim('left', 0.1, [2, 1, 0, 1, 2]);
        this.addAnim('up', 0.1, [7, 6, 5, 6, 7]);
        this.addAnim('right', 0.1, [12, 11, 10, 11, 12]);
        this.addAnim('down', 0.1, [17, 16, 15, 16, 17]);
        this.currentAnim = this.anims['idle' + this.facing];
        this.state = 'idle';
        return this.parent(x, y, opts);
      },
      draw: function() {
        this.parent();
        this.bombHud.draw(this.hudX, this.hudY);
        this.rangeHud.draw(this.hudX, this.hudY + 24);
        this.font.draw(this.bombCount, this.hudX + 24, this.hudY + 5);
        return this.font.draw(this.bombRange, this.hudX + 24, this.hudY + 30);
      },
      update: function() {
        this.move('idle');
        if (ig.input.state(this.name + 'up')) {
          this.move('up');
        }
        if (ig.input.state(this.name + 'down')) {
          this.move('down');
        }
        if (ig.input.state(this.name + 'left')) {
          this.move('left');
        }
        if (ig.input.state(this.name + 'right')) {
          this.move('right');
        }
        if (ig.input.pressed(this.name + 'bomb')) {
          this.placeBomb();
        }
        return this.parent();
      },
      removeBomb: function(bomb) {
        return this.bombs.erase(bomb);
      },
      handleMovementTrace: function(res) {
        this.parent(res);
        this._handleCornerSmoothing(res, 'x');
        return this._handleCornerSmoothing(res, 'y');
      },
      _handleCornerSmoothing: function(res, collisionAxies) {
        var axies, belowCenter, diff, mod, size;
        axies = collisionAxies === 'x' ? 'y' : 'x';
        if (res.collision[collisionAxies]) {
          size = this.size[axies];
          mod = res.pos[axies] % size;
          belowCenter = mod < size / 2;
          diff = belowCenter ? mod : size - mod;
          if (Math.abs(diff) < (size / 3)) {
            if (belowCenter) {
              return this.pos[axies] -= diff;
            } else {
              return this.pos[axies] += diff;
            }
          }
        }
      },
      placeBomb: function() {
        var targetX, targetY;
        if (this.bombs.length < this.bombCount) {
          targetX = Math.floor((this.pos.x + this.size.x / 2) / this.size.x) * this.size.x;
          targetY = Math.floor((this.pos.y + this.size.y / 2) / this.size.y) * this.size.y;
          return this.bombs.push(ig.game.spawnEntity(ig.EntityBomb, targetX, targetY, {
            owner: this
          }));
        }
      },
      receiveDamage: function(from) {
        ig.game.stopRound();
        return this.kill();
      },
      incrementBombCount: function() {
        return this.bombCount += 1;
      },
      incrementBombRange: function() {
        return this.bombRange += 1;
      },
      move: function(direction) {
        if (direction === this.state) {
          return;
        }
        if (direction === "idle") {
          this.currentAnim = this.anims['idle' + this.facing];
        } else {
          this.facing = direction;
          this.currentAnim = this.anims[direction];
        }
        switch (direction) {
          case 'up':
            this.vel.y = -200;
            this.vel.x = 0;
            break;
          case 'down':
            this.vel.y = 200;
            this.vel.x = 0;
            break;
          case 'left':
            this.vel.y = 0;
            this.vel.x = -200;
            break;
          case 'right':
            this.vel.y = 0;
            this.vel.x = 200;
            break;
          case 'idle':
            this.vel.y = 0;
            this.vel.x = 0;
            break;
        }
        return this.state = direction;
      }
    });
  });
}).call(this);
