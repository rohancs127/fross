var BOUNDING_RECT_OFFSET = 8;
var BOUNDING_RECT_SIZE = 48;

var command = {};
var player;
var display;
var mapDisplay;
var gameloop;
var assetManager;
var mapLevel;
var gameMap;

document.addEventListener('DOMContentLoaded', function(){
	display = document.getElementById('display');
	mapDisplay = document.getElementById('mapdisplay');
	assetManager = new AssetManager();
	assetManager.pushAssetURL(PLAYER_ASSET_URL);
	assetManager.setCompletionHandler(initializeGame);
	assetManager.downloadAssets();

});

function initializeGame() {
	initializeEventListener();
	initializePlayer(100, 100);
	initializeMap(100, 100);

	gameloop = setInterval(function() {
		gameLogic();
	}, 1000/60)
}

function initializePlayer(left, top) {
	PLAYER_ASSET = assetManager.getAsset(PLAYER_ASSET_URL);
	player = new Player(new Sprite(display.getContext('2d'), PLAYER_ASSET, left, top, TILE_SIZE, TILE_SIZE), left, top);
}

function initializeMap(left, top) {
	mapLevel = 1;
	setMapLevel(mapLevel, left, top);
}

function setMapLevel(level, left, top) {
	gameMap = new FloorMap(level, mapDisplay, left, top);
	var startPos = gameMap.getStartingPosition();
	player.setPosition(startPos.left, startPos.top);
}

function initializeEventListener() {

	document.addEventListener('keydown', function(e) {
		if(e.which == 37) {
			command['LEFT'] = true;
		} else if (e.which == 38) {
			command['UP'] = true;
		} else if (e.which == 39) {
			command['RIGHT'] = true;
		} else if (e.which == 40) {
			command['DOWN'] = true;
		}
	});
	document.addEventListener('keyup', function(e) {
		if(e.which == 37) {
			delete command['LEFT'];
		} else if (e.which == 38) {
			delete command['UP'];
		} else if (e.which == 39) {
			delete command['RIGHT'];
		} else if (e.which == 40) {
			delete command['DOWN'];
		}
	})
}

function gameLogic() {
	commandHandler();
	render();
}

function commandHandler() {
	var notMoving = true;
	if(command['UP']) {
		if(collisionCheck(BOUNDING_RECT_OFFSET, BOUNDING_RECT_OFFSET - PLAYER_SPEED)) {
			notMoving = false;
			player.moveUp();
		}
	}
	if(command['DOWN']) {
		if(collisionCheck(BOUNDING_RECT_OFFSET, -BOUNDING_RECT_OFFSET + 15 + PLAYER_SPEED)) {
			notMoving = false;
			player.moveDown();
		}
	}
	if(command['RIGHT']) {
		if(collisionCheck(-BOUNDING_RECT_OFFSET + 15 + PLAYER_SPEED, BOUNDING_RECT_OFFSET)) {
			notMoving = false;
			player.moveRight();
		}
	}
	if(command['LEFT']) {
		if(collisionCheck(BOUNDING_RECT_OFFSET - PLAYER_SPEED, BOUNDING_RECT_OFFSET)) {
			notMoving = false;
			player.moveLeft();
		}
	}
	if(notMoving) {
		player.stopMoving();
	}
}


function collisionCheck(leftOffset, topOffset) {
	return gameMap.willStepOn(player.left + leftOffset,
							  player.top + topOffset,
							  BOUNDING_RECT_SIZE,
							  BOUNDING_RECT_SIZE);
}

function render(){
	display.getContext('2d').clearRect(0, 0, 1024, 640);
	player.render();
	gameMap.render();
}

function gameOver() {
	player.fallDown();
	clearInterval(gameloop);
}

