ig.module(
  'game.entities.wall'
)
.requires(
  'impact.entity',
  'impact.font',
  'impact.timer'
)
.defines ->
  ig.EntityWall = ig.Entity.extend
    size:      {x: GameConfig.map.tileSize, y: GameConfig.map.tileSize},
    animSheet: new ig.AnimationSheet('media/wall.png', GameConfig.map.tileSize, GameConfig.map.tileSize)
    collides:  ig.Entity.COLLIDES.FIXED
    type:      ig.Entity.TYPE.A
    init: (x, y, opts) ->
      @modName = opts.modName if opts.modName
      this.addAnim('idle', 1, [0])
      this.addAnim('kill', 0.35, [1, 2, 3])
      this.parent(x, y, opts)

    isAt: (x,y) -> (@pos.x is x) and (@pos.y is y)

    animatedKill: ->
      @timer       = new ig.Timer(GameConfig.gameplay.killTimer)
      @currentAnim = @anims['kill']

    kill: ->
      this.parent()
      ig.game.removeWall(this)
      ig.game.spawnModifier(name: @modName, x: @pos.x, y: @pos.y) if @modName

    update: ->
      this.kill() if @timer and @timer.delta() > 0
      this.parent()
