function GameOfLifeController($scope, $timeout) {
  $scope.cellSize = 10;
  $scope.cells = [];

  $scope.createCell = function(p) {
    $scope.cells.push({x: Math.floor(e.y/10), y: Math.floor(e.x/10)})
  };

  var distance = function(p1, p2) {
    return Math.abs(p1 - p2);
  };

  var distanceBetweenCells = function(a, b) {
    var distanceX = distance(a.x, b.x);
    var distanceY = distance(a.y, b.y);
    return Math.max(distanceX,distanceY);
  };

  var countNumberOfNeighbours = function(cell) {
    var neighbour_count = 0;

    angular.forEach($scope.cells, function(other_cell) {
      var distance = distanceBetweenCells(cell, other_cell);

      if (distance > 0 && distance < 2) {
        neighbour_count++;
      }
    });
    return neighbour_count;
  };

  var deadNeighboursFor = function(cell) {
    var deadNeighbours = [];

    for(var x=-1; x <= 1; x++) {
      for(var y=-1; y <= 1; y++) {
        var possibleCell = {x: cell.x + x, y: cell.y + y}
        if ($scope.cells.indexOf(possibleCell) < 0) {
          deadNeighbours.push(possibleCell)
        }
      }
    }

    return deadNeighbours;
  };

  $scope.running = false;
  var tickPromise; //used to pause the game

  $scope.start = function() {
    $scope.running = true;

    var nextCellKeys = []; //using keys for uniqueness
    var addToNextCellKeys = function(cellKey) {
      if(nextCellKeys.indexOf(cellKey) == -1) {
        nextCellKeys.push(cellKey);
      }
    }

    var deadCellCounts = {};

    angular.forEach($scope.cells, function(cell) {
      var neighbourCount = countNumberOfNeighbours(cell)
      var cellKey = cell.x + " " + cell.y;

      if(neighbourCount == 2 || neighbourCount == 3) {
        addToNextCellKeys(cellKey);
      }
      
      var deadCells = deadNeighboursFor(cell);
      angular.forEach(deadCells, function(deadCell) {
        var deadCellKey = deadCell.x + " " + deadCell.y;

        if(!deadCellCounts[deadCellKey]) {
          deadCellCounts[deadCellKey] = 1;
        } else {
          deadCellCounts[deadCellKey]++;
        }
      });
    });

    angular.forEach(deadCellCounts, function(liveNeighbourCount, cellKey) {
      if(liveNeighbourCount === 3) {
        addToNextCellKeys(cellKey);
      }
    });

    var nextCells = [];

    angular.forEach(nextCellKeys, function(cellKey) {
      var tokens = cellKey.split(" ");
      var cellX = parseInt(tokens[0]);
      var cellY = parseInt(tokens[1]);
      var cell = {x: cellX, y: cellY};
      nextCells.push(cell);
    });

    $scope.cells = nextCells;
    tickPromise = $timeout($scope.start, 1000)
  };

  $scope.pause = function() {
    $timeout.cancel(tickPromise);
    $scope.running = false;
  };
}
