
// Taken from MDN example on Math.random()
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function MapGenerator() {

}

MapGenerator.prototype.generateMap = function() {
	var height = getRandomInt(4, 10);
	var width = getRandomInt(4, 10);
	var startRow = getRandomInt(0, height);
	var startCol = getRandomInt(0, width);
	var visited = new Array(height);
	console.log(height, width);
	for (var i = 0; i < height; i++) {
		visited[i] = [];
		for (var j = 0; j < width; j++) {
			visited[i].push(false);
		}
	}
	console.log(visited);
	var curRow = startRow;
	var curCol = startCol;
	var movRow = [-1, 0, 1, 0]; //N, E, S, W
	var movCol = [0, 1, 0, -1];
	var minPathLength = width * height / 2;
	var curPathLength = 0;
	while (true) {
		visited[curRow][curCol] = true;
		var neighbours = [];
		for (var i = 0; i < movRow.length; i++) {
			var tr = curRow + movRow[i];
			var tc = curCol + movCol[i];
			if (tr >= 0 && tr < height && tc >= 0 && tc < width && !visited[tr][tc]) {
				neighbours.push( [tr, tc] );
			}
		}
		if (neighbours.length === 0 || (Math.random() < 0.02 && !(curRow === startRow && curCol === startCol) && curPathLength >= minPathLength)) {
			var endRow = curRow;
			var endCol = curCol;
			break;
		} else {
			++curPathLength;
			var next = neighbours[getRandomInt(0, neighbours.length)];
			curRow = next[0];
			curCol = next[1];
		}
	}
	for (var r = 0; r < height; r++) {
		for (var c = 0; c < width; c++) {
			if (r === endRow && c === endCol) {
				visited[r][c] = 'F';
			} else if (r === startRow && c === startCol) {
				visited[r][c] = 'S';
			} else if (visited[r][c]) {
				visited[r][c] = '.';
			} else {
				visited[r][c] = 'X';
			}
		}
	}
	return visited;
};


