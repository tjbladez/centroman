ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'impact.font',
	'game.entities.bomb'
)
.defines ->
  ig.EntityPlayer = ig.Entity.extend
    size: {x: GameConfig.map.tileSize, y: GameConfig.map.tileSize}
    collides: ig.Entity.COLLIDES.PASSIVE
    type: ig.Entity.TYPE.A
    font: new ig.Font('media/font-24_orange.png')
    bombs: []
    init: (x, y, opts) ->
      @maxVel.x  = GameConfig.gameplay.maxVel
      @maxVel.y  = GameConfig.gameplay.maxVel
      @name      = opts.name
      @facing    = opts.facing
      @hudX      = opts.hudX
      @hudY      = opts.hudY
      @animSheet = new ig.AnimationSheet("media/#{@name}.png", @size.x, @size.y)
      @bombRange = GameConfig.gameplay.bombRange
      @bombCount = GameConfig.gameplay.bombCount
      @bombHud   = new ig.Image('media/bomb_24.png')
      @rangeHud  = new ig.Image('media/explosion_24.png')
      this.addAnim('idleleft', 1, [4])
      this.addAnim('idleup', 1, [9])
      this.addAnim('idleright', 1, [14])
      this.addAnim('idledown', 1, [19])
      this.addAnim('left', 0.1, [2, 1, 0, 1, 2])
      this.addAnim('up', 0.1, [7, 6, 5, 6, 7])
      this.addAnim('right', 0.1, [12, 11, 10, 11, 12])
      this.addAnim('down', 0.1, [17, 16, 15, 16, 17])

      @currentAnim = @anims['idle' + @facing]
      @state = 'idle'
      this.parent(x, y, opts)

    draw: ->
      this.parent()
      @bombHud.draw(@hudX, @hudY)
      @rangeHud.draw(@hudX, @hudY + 24)
      @font.draw(@bombCount, @hudX+24, @hudY+5)
      @font.draw(@bombRange, @hudX+24, @hudY+30)
    update: ->
      @move('idle')

      this.move('up')    if ig.input.state(@name+'up')
      this.move('down')  if ig.input.state(@name+'down')
      this.move('left')  if ig.input.state(@name+'left')
      this.move('right') if ig.input.state(@name+'right')
      this.placeBomb()   if ig.input.pressed(@name+'bomb')
      this.parent()

    removeBomb: (bomb) ->
      @bombs.erase(bomb)

    handleMovementTrace: (res) ->
      this.parent(res)

      this._handleCornerSmoothing(res, 'x')
      this._handleCornerSmoothing(res, 'y')

    _handleCornerSmoothing: (res, collisionAxies) ->
      axies = if collisionAxies is 'x' then 'y' else 'x'
      if res.collision[collisionAxies]
        size        = @size[axies]
        mod         = res.pos[axies] % size
        belowCenter = mod < size/2
        diff        = if belowCenter then mod else size - mod
        if Math.abs(diff) < (size/3)
          if belowCenter then @pos[axies] -= diff else @pos[axies] += diff

    placeBomb: ->
      if @bombs.length < @bombCount
        targetX = Math.floor((@pos.x + @size.x / 2) / @size.x) * @size.x
        targetY = Math.floor((@pos.y + @size.y / 2) / @size.y) * @size.y
        @bombs.push(ig.game.spawnEntity(ig.EntityBomb, targetX, targetY, {owner: this}))

    receiveDamage: (from) ->
      ig.game.stopRound()
      this.kill()

    incrementBombCount: -> @bombCount += 1
    incrementBombRange: -> @bombRange += 1

    move: (direction) ->
      return if direction is @state
      if direction is "idle"
        @currentAnim = @anims['idle' + @facing]
      else
        @facing = direction
        @currentAnim = @anims[direction]
      switch direction
        when 'up' then @vel.y = -200; @vel.x = 0; break
        when 'down' then @vel.y = 200; @vel.x = 0; break
        when 'left' then @vel.y = 0; @vel.x = -200; break
        when 'right' then @vel.y = 0; @vel.x = 200; break
        when 'idle' then @vel.y = 0; @vel.x = 0; break
      @state = direction
