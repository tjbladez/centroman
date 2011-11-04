ig.module(
  'game.entities.round-over'
)
.requires(
  'impact.entity'
)
.defines ->
  ig.RoundOver = ig.Entity.extend
    size: {x: GameConfig.main.width, y: GameConfig.main.height}
    animSheet: new ig.AnimationSheet('media/roundover.png', GameConfig.main.width, GameConfig.main.height)
    init: (x,y,opts) ->
      @name = "round_over"
      this.addAnim("draw_death", 0.5, [0,1])
      this.addAnim("draw_time", 0.5, [2,5])
      this.addAnim("player1", 0.5, [3,4])
      this.addAnim("player2", 0.5, [6,7])
      this.parent(x, y, opts)
    draw: ->
      players = ig.game.getEntitiesByType(ig.EntityPlayer)
      @currentAnim = @anims['draw_death']    if players.length is 0
      @currentAnim = @anims[players[0].name] if players.length is 1
      @currentAnim = @anims['draw_time']     if players.length is 2

      this.parent()
    update: ->
      this.parent()
      if ig.input.pressed('enter')
        this.kill()
        ig.game.restart()
