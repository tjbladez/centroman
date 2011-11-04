ig.module(
  'game.entities.bomb-powerup'
)
.requires(
  'game.entities.modifier',
)
.defines ->
  ig.BombPowerup = ig.Modifier.extend
    animSheet: new ig.AnimationSheet('media/bomb_powerup.png', GameConfig.map.tileSize, GameConfig.map.tileSize),
    checkAgainst: ig.Entity.TYPE.A
    check: (other) ->
      if (other instanceof ig.EntityPlayer)
        other.incrementBombCount()
        this.kill()