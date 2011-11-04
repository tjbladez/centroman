(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ig.module('game.main').requires('impact.game', 'impact.font', 'impact.timer', 'game.levels.main', 'game.entities.player', 'game.entities.wall', 'game.entities.title', 'game.entities.round-over', 'game.entities.round-time', 'game.entities.bomb-powerup', 'game.entities.range-powerup').defines(function() {
    var Ita;
    Ita = ig.Game.extend({
      init: function() {
        this.state = 'title';
        this._prepareBinding();
        return this.spawnEntity(ig.Title, 0, 0, {
          leftKey: GameConfig.main.menuLeft,
          rightKey: GameConfig.main.menuRight
        });
      },
      update: function() {
        switch (this.state) {
          case "roundover":
            return this.getEntityByName('round_over').update();
          case "title":
            return this.getEntityByName('title_screen').update();
          default:
            return this.parent();
        }
      },
      start: function() {
        this.loadLevel(LevelMain);
        return this._resetLevel();
      },
      stopRound: function() {
        this.state = 'roundover';
        if (!this.getEntityByName('round_over')) {
          return this.spawnEntity(ig.RoundOver, 0, 0);
        }
      },
      restart: function() {
        return this._resetLevel();
      },
      spawnModifier: function(settings) {
        var modifier;
        if (settings.name === 'bomb_powerup') {
          modifier = this.spawnEntity(ig.BombPowerup, settings.x, settings.y);
        }
        if (settings.name === 'range_powerup') {
          modifier = this.spawnEntity(ig.RangePowerup, settings.x, settings.y);
        }
        if (modifier) {
          return this.modifiers.push(modifier);
        }
      },
      removeWall: function(wall) {
        return this.walls.erase(wall);
      },
      removeModifier: function(modifier) {
        return this.modifiers.erase(modifier);
      },
      _resetLevel: function() {
        this._clearEntities();
        this._generateWalls();
        this._spawnPlayers();
        this.spawnEntity(ig.RoundTime, 0, 0);
        return this.state = 'ready';
      },
      _spawnPlayers: function() {
        this.players = [];
        return GameConfig.players.forEach(__bind(function(config) {
          var player;
          player = this.spawnEntity(ig.EntityPlayer, config.startX, config.startY, {
            name: config.name,
            facing: config.facing,
            hudX: config.hudX,
            hudY: config.hudY
          });
          return this.players.push(player);
        }, this));
      },
      _clearEntities: function() {
        var entity, _i, _len, _ref;
        _ref = this.entities;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entity = _ref[_i];
          this.removeEntity(entity);
        }
        return this.modifiers = [];
      },
      _prepareBinding: function() {
        GameConfig.players.forEach(function(config) {
          ig.input.bind(config.up, config.name + 'up');
          ig.input.bind(config.down, config.name + 'down');
          ig.input.bind(config.left, config.name + 'left');
          ig.input.bind(config.right, config.name + 'right');
          return ig.input.bind(config.bomb, config.name + 'bomb');
        });
        return ig.input.bind(ig.KEY.ENTER, 'enter');
      },
      _prepareLocations: function() {
        var x, y, _results;
        this.locations = [];
        _results = [];
        for (x = 1; x < 14; x++) {
          _results.push((function() {
            var _results2;
            _results2 = [];
            for (y = 1; y < 14; y++) {
              if (x === 1 && (y === 1 || y === 2 || y === 3)) {
                continue;
              }
              if (y === 1 && (x === 1 || x === 2 || x === 3)) {
                continue;
              }
              if (x === 13 && (y === 11 || y === 12 || y === 13)) {
                continue;
              }
              if (y === 13 && (x === 11 || x === 12 || x === 13)) {
                continue;
              }
              if (x % 2 === 0 && y % 2 === 0) {
                continue;
              }
              _results2.push(this.locations.push([x * GameConfig.map.tileSize, y * GameConfig.map.tileSize]));
            }
            return _results2;
          }).call(this));
        }
        return _results;
      },
      _generateWalls: function() {
        var i, location, opts, _ref, _results;
        this.walls = [];
        this._prepareLocations();
        _results = [];
        for (i = 1, _ref = GameConfig.gameplay.wallCount; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
          opts = {};
          if (i % 6 === 0) {
            opts = {
              modName: 'bomb_powerup'
            };
          }
          if (i % 5 === 1) {
            opts = {
              modName: 'range_powerup'
            };
          }
          location = this.locations.random();
          this.locations.erase(location);
          _results.push(this.walls.push(this.spawnEntity(ig.EntityWall, location[0], location[1], opts)));
        }
        return _results;
      }
    });
    return ig.main('#canvas', Ita, GameConfig.main.idealFps, GameConfig.main.width, GameConfig.main.height, GameConfig.main.scaleRatio);
  });
}).call(this);
