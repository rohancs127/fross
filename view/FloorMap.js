"use strict";

var mapStore = new MapStore();

function FloorMap(level, canvas, left, top) {
	var mapData = mapStore.getMap(level);
	var height = mapData.length;
	var width = (height > 0) ? mapData[0].length : 0;
	this.left = (1024 - width * TILE_SIZE)/2;
	this.top = (640 - height * TILE_SIZE)/2;
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
			var tile = new Tile(this.left + TILE_SIZE * col, this.top + TILE_SIZE * row, canvas);
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
					tile.setState(TileState.FINISH_LOCKED);
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
	if (this.isSatisfied()) {
		var f = this.finishPos;
		this.tiles[f[0]][f[1]].setState(TileState.FINISH_UNLOCKED);
	}
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

FloorMap.prototype.getStartingPosition = function() {
	var left = this.startPos[1] * TILE_SIZE + this.left;
	var top = this.startPos[0] * TILE_SIZE + this.top;
	return {
		"left": left,
		"top": top,
	}
};

FloorMap.prototype.getFinishingPosition = function() {
	var left = this.finishPos[1] * TILE_SIZE + this.left;
	var top = this.finishPos[0] * TILE_SIZE + this.top;
	return {
		"left": left,
		"top": top,
	}
};

FloorMap.prototype.willStepOn = function(left, top, width, height) {
	if(this.left -20  > left || this.top -20 > top || this.left + (this.width - 1) * TILE_SIZE + 20 < left || this.top + (this.height - 1) * TILE_SIZE + 20 < top) return false;
	for (var i = 0; i < this.height; ++i) {
		for (var j = 0; j < this.width; ++j) {
			var tileTop = i * TILE_SIZE + this.top + 8;
			var tileLeft = j * TILE_SIZE + this.left + 8;
			var isContained = this.collisionWith(tileLeft, tileTop, left, top, width, height);
			if(isContained) {
				if (this.tiles[i][j].isBrokenOrBlocked()) return false;
			}
		}
	}
	return true;
};

FloorMap.prototype.isSteppingOn = function(left, top, width, height) {
	for (var i = 0; i < this.height; ++i) {
		for (var j = 0; j < this.width; ++j) {
			var tileTop = i * TILE_SIZE + this.top + 8;
			var tileLeft = j * TILE_SIZE + this.left + 8;
			var isContained = this.collisionWith(tileLeft, tileTop, left, top, width, height);
			if(isContained) {
				this.tiles[i][j].stepIn();
				return;
			}
		}
	}
}

FloorMap.prototype.collisionWith = function(tileLeft, tileTop, left, top, width, height) {
	var isContained = true;
	if(tileTop <= top) {
		if(tileTop + TILE_SIZE - 16 < top) isContained = false;
	} else {
		if(top + height < tileTop) isContained = false;
	}
	if(tileLeft <= left) {
		if(tileLeft + TILE_SIZE - 16 < left) isContained = false;
	} else {
		if(left + width < tileLeft) isContained = false;
	}
	return isContained;
}

FloorMap.prototype.isFinishTile = function(x, y) {
	// body...
};

FloorMap.prototype.isBrokenTile = function(x, y) {
	// body...
};

FloorMap.prototype.coordinateToIndex = function(x, y) {
	
};
