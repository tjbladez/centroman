(function() {
  ig.module('game.entities.bomb').requires('game.entities.explosion', 'impact.entity').defines(function() {
    return ig.EntityBomb = ig.Entity.extend({
      size: {
        x: GameConfig.map.tileSize,
        y: GameConfig.map.tileSize
      },
      collides: ig.Entity.COLLIDES.FIXED,
      type: ig.Entity.TYPE.A,
      animSheet: new ig.AnimationSheet('media/dynamite.png', GameConfig.map.tileSize, GameConfig.map.tileSize),
      init: function(x, y, opts) {
        this.owner = opts.owner;
        this.range = this.owner.bombRange;
        this.ownerDidLeave = false;
        this.duration = GameConfig.gameplay.fuse;
        this.addAnim('idle', 0.5, [0, 1, 2, 3]);
        return this.parent(x, y, opts);
      },
      update: function() {
        if (this.duration > 0) {
          this.checkOwnerLocation();
          this.duration -= 1;
        } else {
          this.startExplosion();
          this.owner.removeBomb(this);
          this.kill();
        }
        return this.parent();
      },
      startExplosion: function() {
        var exp;
        exp = ig.game.spawnEntity(ig.EntityExplosion, this.pos.x + 2, this.pos.y + 2, {
          owner: this.owner
        });
        this._explodeDirection('right');
        this._explodeDirection('down');
        this._explodeDirection('left');
        return this._explodeDirection('up');
      },
      _explodeDirection: function(direction) {
        var i, _ref, _results;
        _results = [];
        for (i = 1, _ref = this.range; 1 <= _ref ? i < _ref : i > _ref; 1 <= _ref ? i++ : i--) {
          try {
            if (direction === "right") {
              this.explode(i * GameConfig.map.tileSize, 0, i * GameConfig.map.tileSize - 1, 0);
            }
            if (direction === "left") {
              this.explode(-i * GameConfig.map.tileSize, 0, -i * GameConfig.map.tileSize + 1, 0);
            }
            if (direction === "up") {
              this.explode(0, -i * GameConfig.map.tileSize, 0, -i * GameConfig.map.tileSize + 1);
            }
            if (direction === "down") {
              this.explode(0, i * GameConfig.map.tileSize, 0, i * GameConfig.map.tileSize - 1);
            }
          } catch (err) {
            break;
          }
        }
        return _results;
      },
      explode: function(incx, incy, tarx, tary) {
        var res, targetX, targetY;
        res = ig.game.collisionMap.trace(this.pos.x, this.pos.y, tarx, tary, this.size.x, this.size.y);
        if (res.collision.x || res.collision.y) {
          throw "can't explode";
        }
        targetX = this.pos.x + incx;
        targetY = this.pos.y + incy;
        ['walls', 'modifiers'].forEach(function(entities) {
          var entity, _i, _len, _ref, _results;
          _ref = ig.game[entities];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            entity = _ref[_i];
            _results.push((function() {
              if (entity.isAt(targetX, targetY)) {
                entity.animatedKill();
                throw "can't explode";
              }
            })());
          }
          return _results;
        });
        return ig.game.spawnEntity(ig.EntityExplosion, targetX + 2, targetY + 2, {
          owner: this.owner
        });
      },
      receiveDamage: function(from) {
        return this.duration = 0;
      },
      checkOwnerLocation: function() {
        if (!this.ownerDidLeave) {
          if (this.distanceTo(this.owner) > this.size.x) {
            return this.ownerDidLeave = true;
          }
        }
      },
      touches: function(other) {
        if (other === this.owner && !this.ownerDidLeave) {
          return false;
        } else {

        }
        return this.parent(other);
      }
    });
  });
}).call(this);
