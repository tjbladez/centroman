ig.module(
  'game.entities.explosion'
)
.requires(
  'impact.entity'
)
.defines ->
  ig.EntityExplosion = ig.Entity.extend
    #HACK: shape 4 pixels off for collision detection
    size: {x: GameConfig.map.reducedTileSize, y: GameConfig.map.reducedTileSize}
    collides: ig.Entity.COLLIDES.NONE
    animSheet: new ig.AnimationSheet('media/explosion.png', GameConfig.map.tileSize, GameConfig.map.tileSize)
    type: ig.Entity.TYPE.B
    checkAgainst: ig.Entity.TYPE.A
    init: (x,y,opts)->
      @owner     = opts.owner
      @duration  = GameConfig.gameplay.explosionDuration
      this.addAnim('idle', 0.05, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      this.parent(x+GameConfig.map.reducedOffset, y+GameConfig.map.reducedOffset, opts)
    update: ->
      this.parent()
      if @duration > 0 then @duration -= 1 else this.kill()
    check: (other) -> other.receiveDamage(this)