ig.module(
  'game.entities.title'
)
.requires(
  'impact.entity'
)
.defines ->
  ig.Title = ig.Entity.extend
    size: {x: GameConfig.main.width, y: GameConfig.main.height}
    animSheet: new ig.AnimationSheet('media/title.png', GameConfig.main.width, GameConfig.main.height)
    init: (x,y,opts) ->
      this.addAnim("idle", 0.5, [1, 0])
      @name        = "title_screen"
      this.parent(x, y, opts)

    update: ->
      this.parent()
      if ig.input.pressed('enter')
        this.kill()
        ig.game.start()
