"use strict";

var mapStore = new MapStore();

function FloorMap(level, canvas) {
	var mapData = mapStore.getMap(level);
	var height = mapData.length;
	var width = (height > 0) ? mapData[0].length : 0;
	this.height = height;
	this.width = width;
	this.tiles = new Array(height);
	for (var i = 0; i < height; i++) {
		this.tiles[i] = new Array(width);
	}
	this.startPos = [0, 0];
	this.finishPos = [0, 0];
	for (var row = 0; row < height; row++) {
		for (var col = 0; col < width; col++) {
			var tile = new Tile(TILE_SIZE * row, TILE_SIZE * col, canvas);
			switch(mapData[row][col]) {
				case '.':
					break;
				case 'X':
					tile.setState(TileState.BLOCKED);
					break;
				case 'S':
					this.startPos = [row, col];
					break;
				case 'F':
					this.finishPos = [row, col];
					break;
				default:
					throw new Error("Invalid map data. (" + row + ", " + col + ") at level " + level);
			}
			tile.render();
			this.tiles[row][col] = tile;
		}
	}

}

FloorMap.prototype.render = function() {
	console.log("hi");
	for (var row = 0; row < this.height; row++) {
		for (var col = 0; col < this.width; col++) {
			this.tiles[row][col].update();
			this.tiles[row][col].render();
		}
	}
};

FloorMap.prototype.renderEvery = function(millis) {
	var map = this;
	setInterval(function() {
		map.render();
	}, millis);
};

FloorMap.prototype.isSatisfied = function() {
	for (var row = 0; row < this.height; row++) {
		for (var col = 0; col < this.width; col++) {
			if (this.tiles[row][col].state === TileState.CLEAN) {
				return false;
			}
		}
	}
	return true;
};
