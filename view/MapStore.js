"use strict";

function MapStore() {
	this.data = MapStore.prototype.data;
}

MapStore.prototype.getMap = function(level) {
	if (level in this.data) {
		return this.data[level];
	} else {
		throw new Error("No such map available!");
	}
};

MapStore.prototype.data = {
	1: ["..F..",
		".....",
		".....",
		"X....",
		"S...X"],
	2: []
};