var snap = Snap('#flood');

var GraphicalCell = function(color, i, j) {
    this.rect = snap.rect(1000 * i / gridSize,
        1000 * j / gridSize,
        1000 / gridSize,
        1000 / gridSize);
    this.rect.attr({
        class: "color-" + color,
        shapeRendering: "crispEdges"
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


var gridSize = 10;
var colorCount = 6;

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

function switchColor(color) {
    if (color < 0 || color >= colorCount) {
        alert("Impossible color: " + color);
        return;
    }
    snap.attr({
        class: "current-" + color
    });
    cells.forEach(function(cell) {
        cell.explore(color);
    });
    if (cells.filter(function(cell) {
        return !cell.inNetwork;
    }).length === 0) {
        alert("youpi !");
    }
}

switchColor(grid[0][0].color);

function makeCircle(i) {
    var circle = snap.circle((2 * i + 1) * 1000 / (colorCount * 2), 1100, 60);
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