globals =
  gridSize: 12
  colorCount: 6

game = Snap('#game')
game.attr(
  viewBox: "0 0 #{globals.gridSize} #{globals.gridSize}"
  shapeRendering: "crispEdges"
)

class GraphicalCell
  constructor: (color, i, j) ->
    @rect = game.rect i, j, 1, 1
    @rect.attr(class: "color-#{color}")

  setInNetwork: () ->
    @rect.attr(class: "in-network")

class Cell
  constructor: (@color, @graphicalCell, @inNetwork) ->
    @graphicalCell.setInNetwork() if @inNetwork
    @neighbours = []

  addNeighbour: (cell) ->
    @neighbours.push cell

  explore: (color) ->
    @navigate(color) if @inNetwork

  expand: (color) ->
    if @inNetwork || @color != color
      return
    @inNetwork = true
    @graphicalCell.setInNetwork()
    @navigate(color)

  navigate: (color) ->
    n.expand(color) for n in @neighbours

class Grid
  constructor: (@gridSize, @colorCount) ->
    row = []
    grid = for i in [0..@gridSize-1]
      row = @createRow(i, row)
    @cells = [].concat.apply([], grid)
    @step = -1
    @switchColor(@cells[0].color)

  createRow: (i, prevRow) ->
    for j in [0..@gridSize-1]
      cell = @createCell i, j, cell, prevRow[j]

  createCell: (i, j, neighbours...) ->
    color = Math.floor Math.random() * @colorCount
    graphicalCell = new GraphicalCell(color, i, j)
    cell = new Cell(color, graphicalCell, i == 0 && j == 0)
    for neighbour in neighbours when neighbour
      cell.addNeighbour neighbour
      neighbour.addNeighbour cell
    return cell

  switchColor: (color) ->
    unless 0 <= color < @colorCount
      alert "Impossible color: #{color}"
      return
    return if color == @color
    @color = color
    stepText.node.textContent = "Step #{++@step}"
    game.attr(class: "current-#{color}")
    cell.explore(color) for cell in @cells
    if (c for c in @cells when !c.inNetwork).length == 0
      alert "Youpi !"
      window.location = window.location

topControls = Snap '#top-controls'
stepText = topControls.text 2, 5, ""

grid = new Grid(globals.gridSize, globals.colorCount)


bottomControls = Snap '#bottom-controls'

makeCircle = (i) ->
  circle = bottomControls.circle((2 * i + 1) * 100 / (globals.colorCount * 2), 10, 6)
  circle.attr(class: "color-#{i}")
  circle.click(() -> grid.switchColor(i))

makeCircle(i) for i in [0..globals.colorCount-1]