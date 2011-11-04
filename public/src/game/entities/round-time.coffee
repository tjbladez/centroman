ig.module(
  'game.entities.round-time'
)
.requires(
  'impact.entity',
  'impact.font'
)
.defines ->
  ig.RoundTime = ig.Entity.extend
    font: new ig.Font('media/font-48_orange.png')
    init: (x,y,opts) ->
      @countdown = GameConfig.gameplay.roundTime
      this.parent(x, y, opts)
    draw: ->
      #magic numbers :( .FIXME: add proper HUD
      @font.draw("#{@minutes}:#{@seconds}", 324, 1)
      this.parent()
    update: ->
      this.parent()

      ticks    = Math.floor(@countdown/60) #ideally matches seconds, varries by fps
      @minutes = Math.floor(ticks/60)
      @seconds = ticks % 60
      @seconds = "0"+ @seconds if @seconds < 10
      @countdown -= 1
      if @countdown is 0
        ig.game.stopRound()
        this.kill()
