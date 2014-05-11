var gridSize = 12;
var colorCount = 6;

var game = Snap('#game');
game.attr({
    viewBox: "0 0 " + gridSize + " " + gridSize,
    shapeRendering: "crispEdges"
});

var GraphicalCell = function(color, i, j) {
    this.rect = game.rect(i, j, 1, 1);
    this.rect.attr({
        class: "color-" + color
    });
};

GraphicalCell.prototype.setInNetwork = function() {
    this.rect.attr({
        class: "in-network"
    });
};


var Cell = function(color, graphicalCell, inNetwork) {
    this.color = color;
    this.graphicalCell = graphicalCell;
    this.inNetwork = inNetwork;
    if (this.inNetwork) {
        graphicalCell.setInNetwork();
    }
    this.neighbours = [];
};

Cell.prototype.addNeighbour = function(anotherCell) {
    this.neighbours.push(anotherCell);
};

Cell.prototype.explore = function(color) {
    if (this.inNetwork) {
        this.navigate(color);
    }
};

Cell.prototype.expand = function(color) {
    if (this.inNetwork || this.color !== color) {
        return;
    }
    this.inNetwork = true;
    this.graphicalCell.setInNetwork();
    this.navigate(color);
};

Cell.prototype.navigate = function(color) {
    this.neighbours.forEach(function(neighbour) {
        neighbour.expand(color);
    });
};


var grid = [];
var cells = [];

for (var i = 0; i < gridSize; ++i) {
    var row = [];
    for (j = 0; j < gridSize; ++j) {
        var color = Math.floor(Math.random() * colorCount);
        var graphicalCell = new GraphicalCell(color, i, j);
        var cell = new Cell(color, graphicalCell, i === 0 && j === 0);
        if (i > 0) {
            cell.addNeighbour(grid[i - 1][j]);
            grid[i - 1][j].addNeighbour(cell);
        }
        if (j > 0) {
            cell.addNeighbour(row[j - 1]);
            row[j - 1].addNeighbour(cell);
        }
        row.push(cell);
        cells.push(cell);
    }
    grid.push(row);
}

var topControls = Snap('#top-controls');
var stepText = topControls.text(2, 5, "Plop");
stepText.attr({
    style: "font-size: 5px"
});
var step = -1;

function switchColor(color) {
    stepText.node.textContent = 'Step ' + (++step);
    if (color < 0 || color >= colorCount) {
        alert("Impossible color: " + color);
        return;
    }
    game.attr({
        class: "current-" + color
    });
    cells.forEach(function(cell) {
        cell.explore(color);
    });
    if (cells.filter(function(cell) {
        return !cell.inNetwork;
    }).length === 0) {
        alert("youpi !");
        window.location = window.location;
    }
}

switchColor(grid[0][0].color);

var bottomControls = Snap('#bottom-controls');

function makeCircle(i) {
    var circle = bottomControls.circle((2 * i + 1) * 100 / (colorCount * 2), 10, 6);
    circle.attr({
        class: "color-" + i
    });
    circle.click(function() {
        switchColor(i);
    });
}

for (var i = 0; i < colorCount; ++i) {
    makeCircle(i);
}