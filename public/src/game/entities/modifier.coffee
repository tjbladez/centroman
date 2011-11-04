ig.module(
  'game.entities.modifier'
)
.requires(
  'impact.entity'
)
.defines ->
  ig.Modifier = ig.Entity.extend
    #FIXME: shape pixels off for collision detection
    size: {x: GameConfig.map.reducedTileSize, y: GameConfig.map.reducedTileSize}
    collides: ig.Entity.COLLIDES.NONE,
    type: ig.Entity.TYPE.A
    init: (x, y, opts) ->
      this.addAnim('idle', 1, [0])
      this.addAnim('kill', 0.2, [1, 0])
      this.parent(x+GameConfig.map.reducedOffset, y+GameConfig.map.reducedOffset, opts)
    isAt: (x,y) ->
      (@pos.x-GameConfig.map.reducedOffset is x) and (@pos.y-GameConfig.map.reducedOffset is y)

    animatedKill: ->
      @timer       = new ig.Timer(GameConfig.gameplay.killTimer)
      @currentAnim = @anims['kill']
    kill: ->
      this.parent()
      ig.game.removeModifier(this)
    update: ->
      this.parent()
      this.kill() if @timer and @timer.delta() > 0
