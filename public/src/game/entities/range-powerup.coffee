ig.module(
  'game.entities.range-powerup'
)
.requires(
  'game.entities.modifier',
)
.defines ->
  ig.RangePowerup = ig.Modifier.extend
    animSheet: new ig.AnimationSheet('media/range_powerup.png', GameConfig.map.tileSize, GameConfig.map.tileSize),
    checkAgainst: ig.Entity.TYPE.A
    check: (other) ->
      if (other instanceof ig.EntityPlayer)
        other.incrementBombRange()
        this.kill()