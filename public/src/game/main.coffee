ig.module(
  'game.main'
)
.requires(
  'impact.game',
  'impact.font',
  'impact.timer',
  'game.levels.main',
  'game.entities.player',
  'game.entities.wall',
  'game.entities.title',
  'game.entities.round-over',
  'game.entities.round-time',
  'game.entities.bomb-powerup',
  'game.entities.range-powerup'
)
.defines ->
  Ita = ig.Game.extend
    init: ->
      @state = 'title'
      this._prepareBinding()
      this.spawnEntity(ig.Title, 0, 0, {leftKey: GameConfig.main.menuLeft, rightKey: GameConfig.main.menuRight})

    update: ->
      switch @state
        when "roundover" then this.getEntityByName('round_over').update()
        when "title" then this.getEntityByName('title_screen').update()
        else this.parent()

    start: ->
      this.loadLevel(LevelMain)
      this._resetLevel()

    stopRound: ->
      @state = 'roundover'
      this.spawnEntity(ig.RoundOver, 0, 0) unless this.getEntityByName('round_over')

    restart: ->  this._resetLevel()

    spawnModifier: (settings)->
      if settings.name is 'bomb_powerup'
        modifier = this.spawnEntity(ig.BombPowerup, settings.x, settings.y)
      if settings.name is 'range_powerup'
        modifier = this.spawnEntity(ig.RangePowerup, settings.x, settings.y)

      @modifiers.push(modifier) if modifier

    removeWall: (wall) ->
      @walls.erase(wall)
    removeModifier: (modifier) ->
      @modifiers.erase(modifier)
    _resetLevel: ->
      this._clearEntities()
      this._generateWalls()
      this._spawnPlayers()
      this.spawnEntity(ig.RoundTime, 0, 0)
      @state = 'ready'

    _spawnPlayers: ->
      @players = []
      GameConfig.players.forEach (config) =>
        player = this.spawnEntity(ig.EntityPlayer, config.startX, config.startY, {
          name: config.name,
          facing: config.facing,
          hudX: config.hudX,
          hudY: config.hudY})
        @players.push(player)

    _clearEntities: ->
      this.removeEntity(entity) for entity in this.entities
      @modifiers = []

    _prepareBinding: ->
      GameConfig.players.forEach (config) ->
        ig.input.bind(config.up,    config.name+'up')
        ig.input.bind(config.down,  config.name+'down')
        ig.input.bind(config.left,  config.name+'left')
        ig.input.bind(config.right, config.name+'right')
        ig.input.bind(config.bomb,  config.name+'bomb')

      ig.input.bind(ig.KEY.ENTER, 'enter')

    #FIXME: remove magic numbers
    #1,2,3 and 11,12,13 are to ensure player locations are clean
    # every even location is an indestructible column
    _prepareLocations: ->
      @locations = []
      for x in [1...14]
          for y in [1...14]
            continue if (x is 1 and y in [1,2,3])
            continue if (y is 1 and x in [1,2,3])
            continue if (x is 13 and y in [11,12,13])
            continue if (y is 13 and x in [11,12,13])
            continue if x % 2 is 0 and y % 2 is 0
            @locations.push([x*GameConfig.map.tileSize, y*GameConfig.map.tileSize])

    _generateWalls: ->
      @walls = []
      this._prepareLocations()

      for i in [1..GameConfig.gameplay.wallCount]
        opts = {}
        opts = { modName: 'bomb_powerup' } if i % 6 is 0
        opts = { modName: 'range_powerup'} if i % 5 is 1

        location = @locations.random()
        @locations.erase(location)
        @walls.push(this.spawnEntity(ig.EntityWall, location[0], location[1], opts))

  ig.main( '#canvas', Ita, GameConfig.main.idealFps, GameConfig.main.width, GameConfig.main.height, GameConfig.main.scaleRatio )