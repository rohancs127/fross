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
	1: ["..F..",
		".....",
		".....",
		"X....",
		"S...X"],
	2: ["...X......",
		"SX...X..F."],
	3: ["....",
		"....",
		"X..F",
		"...X",
		"....",
		".SX.",
		"...."],
	4: [".........F.",
		".....X...X.",
		"...........",
		"X....S..X.."],
	5: ["......",
		".....S",
		".X...F",
		"......",
		"....X.",
		"......"],
	6: ["......",
		".X.S..",
		"...X..",
		"......",
		".X..F.",
		"......"],
	7: ["...F.",
		"...X.",
		"..S..",
		".XX..",
		".....",
		"XX..X"],
	8: ["",
		""]
};