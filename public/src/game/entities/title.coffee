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
      this.addAnim("single", 0.5, [1, 0])
      this.addAnim("multi", 0.5, [3, 2])
      @name        = "title_screen"
      @currentAnim = @anims['single']
      @leftkey     = opts.leftKey
      @rightkey    = opts.rightKey
      this.parent(x, y, opts)

    update: ->
      this.parent()
      @currentAnim = @anims['single'] if ig.input.pressed(@leftKey)
      @currentAnim = @anims['multi']  if ig.input.pressed(@rightKey)
      if ig.input.pressed('enter') && @currentAnim is @anims['multi']
        this.kill()
        ig.game.start()
