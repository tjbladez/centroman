ig.module(
  'game.entities.bomb'
)
.requires(
  'game.entities.explosion',
  'impact.entity'
)
.defines ->
  ig.EntityBomb = ig.Entity.extend
    size: {x: GameConfig.map.tileSize, y: GameConfig.map.tileSize}
    collides: ig.Entity.COLLIDES.FIXED
    type: ig.Entity.TYPE.A
    animSheet: new ig.AnimationSheet('media/dynamite.png', GameConfig.map.tileSize, GameConfig.map.tileSize)
    init: (x,y, opts) ->
      @owner         = opts.owner
      @range         = @owner.bombRange
      @ownerDidLeave = false
      @duration      = GameConfig.gameplay.fuse
      this.addAnim('idle', 0.5, [0, 1, 2, 3])
      this.parent(x, y, opts)
    update: ->
      if @duration > 0
        this.checkOwnerLocation()
        @duration -= 1
      else
        this.startExplosion()
        @owner.removeBomb(this)
        this.kill()
      this.parent()
    startExplosion: ->
      exp = ig.game.spawnEntity(ig.EntityExplosion, @pos.x+2, @pos.y+2, {owner: @owner})
      this._explodeDirection('right')
      this._explodeDirection('down')
      this._explodeDirection('left')
      this._explodeDirection('up')

    _explodeDirection: (direction) ->
      for i in [1...@range]
        try
          if direction is "right" then this.explode(i*GameConfig.map.tileSize, 0, i*GameConfig.map.tileSize-1, 0)
          if direction is "left" then this.explode(-i*GameConfig.map.tileSize, 0, -i*GameConfig.map.tileSize+1, 0)
          if direction is "up" then this.explode(0, -i*GameConfig.map.tileSize, 0, -i*GameConfig.map.tileSize+1)
          if direction is "down" then this.explode(0, i*GameConfig.map.tileSize, 0, i*GameConfig.map.tileSize-1)
        catch err
          break
    explode: (incx, incy, tarx, tary) ->
      res = ig.game.collisionMap.trace(@pos.x, @pos.y, tarx, tary, @size.x, @size.y)
      throw "can't explode" if res.collision.x or res.collision.y
      targetX = @pos.x+incx
      targetY = @pos.y+incy
      ['walls', 'modifiers'].forEach (entities) ->
        for entity in ig.game[entities]
          if entity.isAt(targetX, targetY)
            entity.animatedKill()
            throw "can't explode"
      ig.game.spawnEntity(ig.EntityExplosion, targetX+2, targetY+2, {owner: @owner})

    receiveDamage: (from) -> @duration = 0

    checkOwnerLocation: ->
      unless @ownerDidLeave
        @ownerDidLeave = true if this.distanceTo(@owner) > @size.x

    touches: (other) ->
      if other is @owner and not @ownerDidLeave
        return false
      else
      return this.parent(other)