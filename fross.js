var BOUNDING_RECT_OFFSET = 0;
var BOUNDING_RECT_SIZE = 64;
var TIME_ALIVE = 2000;
var MAP_LEFT = 100;
var MAP_TOP = 100;
var command = {};
var player;
var display;
var mapDisplay;
var gameloop;
var assetManager;
var mapLevel;
var gameMap;
var announcement;
var startButton;
var lastIdle;
var levelBoard;

document.addEventListener('DOMContentLoaded', function(){
	display = document.getElementById('display');
	mapDisplay = document.getElementById('mapdisplay');
	announcement = document.getElementById('announcement');
	startButton = document.getElementById('start');
	levelBoard = document.getElementById('level');
	assetManager = new AssetManager();
	assetManager.pushAssetURL(PLAYER_ASSET_URL);
	assetManager.pushAssetURL('assets/Tile_Finish_Unlocked.png');
	assetManager.pushAssetURL('assets/Tile_Cracked.png');
	assetManager.pushAssetURL('assets/Tile_Clean.png');
	assetManager.pushAssetURL('assets/Tile_Broken.png');
	assetManager.pushAssetURL('assets/Tile_Finish_Locked.png');
	assetManager.pushAssetURL('assets/Tile_Blocked.png');
	assetManager.setCompletionHandler(gameIsReady);
	assetManager.setDownloadedHandler(downloadedHandler);
	assetManager.downloadAssets();

});

function downloadedHandler() {
	var progress = (assetManager.processed / assetManager.numOfAssets) * 100;
	start.innerHTML = 'loading: ' + parseInt(progress) + "%";
}

function gameIsReady() {
	Tile.prototype.setImages();
	startButton.innerHTML = 'Start Fross';
	startButton.addEventListener('click', function() {
		startButton.style.setProperty('z-index', -1);
		startButton.style.setProperty('opacity', 0);
		initializeGame();
	})
}

function initializeGame() {
	initializeEventListener();
	initializePlayer(0, 0);
	initializeMap(MAP_LEFT, MAP_TOP);
	command = {};
	lastIdle = Date.now();
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
	levelBoard.innerHTML = 'Level '+level;
	mapDisplay.getContext('2d').clearRect(0,0,1024,640);
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
	checkGameState();
}

function commandHandler() {
	var notMoving = true;
	if(command['UP']) {
		if(collisionCheck(BOUNDING_RECT_OFFSET, BOUNDING_RECT_OFFSET - 10, BOUNDING_RECT_SIZE, BOUNDING_RECT_SIZE)) {
			notMoving = false;
			player.moveUp();
		}
	}
	if(command['DOWN']) {
		if(collisionCheck(BOUNDING_RECT_OFFSET, -BOUNDING_RECT_OFFSET + 10, BOUNDING_RECT_SIZE, BOUNDING_RECT_SIZE)) {
			notMoving = false;
			player.moveDown();
		}
	}
	if(command['RIGHT']) {
		if(collisionCheck(-BOUNDING_RECT_OFFSET + 10, BOUNDING_RECT_OFFSET, BOUNDING_RECT_SIZE, BOUNDING_RECT_SIZE)) {
			notMoving = false;
			player.moveRight();
		}
	}
	if(command['LEFT']) {
		if(collisionCheck(BOUNDING_RECT_OFFSET - 10, BOUNDING_RECT_OFFSET, BOUNDING_RECT_SIZE, BOUNDING_RECT_SIZE)) {
			notMoving = false;
			player.moveLeft();
		}
	}
	if(notMoving) {
		player.stopMoving();
	} else {
		lastIdle = Date.now();
	}
}


function collisionCheck(leftOffset, topOffset, width, height) {
	return gameMap.willStepOn(player.left + leftOffset,
							  player.top + topOffset,
							  width,
							  height);
}

function render(){
	display.getContext('2d').clearRect(0, 0, 1024, 640);
	player.render();
	gameMap.render();
}

function checkGameState() {
	if(Date.now() - lastIdle > TIME_ALIVE) {
		gameOver();
	}else if (!collisionCheck(6, 8, 20, 10)) {
		gameOver();	
	} else if(gameMap.isSatisfied() && playerIsAtFinishTile()) {
		nextLevel();
	} else {
		gameMap.isSteppingOn(player.left + 8, player.top + 8, 20, 20);
	}
}

function playerIsAtFinishTile() {
	var finishPos = gameMap.getFinishingPosition();
	return gameMap.collisionWith(finishPos.left, finishPos.top, player.left, player.top, BOUNDING_RECT_SIZE, BOUNDING_RECT_SIZE);
}

function nextLevel() {
	mapLevel++;
	mapDisplay.getContext('2d').clearRect(0, 0, 1024, 640);
	setMapLevel(mapLevel, MAP_LEFT, MAP_TOP);
}

function gameOver() {
	clearInterval(gameloop);
	player.fallDown();
	announceGameOver();
	setTimeout(function() {
		showRestartButton();
	}, 1200);
}

function announceGameOver() {
	announcement.innerHTML = "You Died <br> Level Achieved: " + mapLevel;
	announcement.style.setProperty('opacity', 1);
}

function showRestartButton() {
	announcement.style.setProperty('opacity', 0);
	startButton.innerHTML = 'Restart Fross';
	startButton.style.setProperty('z-index', 10);
	startButton.style.setProperty('opacity', 1);
}

function restartGame() {
	initializeGame();
}
