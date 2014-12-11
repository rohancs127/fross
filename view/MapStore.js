"use strict";

function MapStore() {
	this.data = MapStore.prototype.data;
}

MapStore.prototype.getMap = function(level) {
	if (level in this.data) {
		return this.data[level];
	} else {
		//throw new Error("No such map available!");
		//jaman gini masa error?
		return MapGenerator.prototype.generateMap();
	}
};

MapStore.prototype.data = {
	4: ["..F..",
		".....",
		".....",
		"X....",
		"S...X"],
	1: ["...X......",
		"SX...X..F."],
	8: ["....",
		"....",
		"X..F",
		"...X",
		"....",
		".SX.",
		"...."],
	12: [".........F.",
		".....X...X.",
		"...........",
		"X....S..X.."],
	20: ["......",
		".....S",
		".X...F",
		"......",
		"....X.",
		"......"],
	26: ["......",
		".X.S..",
		"...X..",
		"......",
		".X..F.",
		"......"],
	37: ["...F.",
		"...X.",
		"..S..",
		".XX..",
		".....",
		"XX..X"]
};