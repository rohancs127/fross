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
var leftButton;
var upButton
var rightButton;
var downButton;

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
		var instruction = document.getElementById('instruction');
		instruction.style.setProperty('opacity', 0);
		instruction.style.setProperty('z-index', -1);
		initializeGame();
	})
}

function initializeGame() {
	initializeControlKeys();
	initializeEventListener();
	initializePlayer(0, 0);
	initializeMap(MAP_LEFT, MAP_TOP);
	command = {};
	lastIdle = Date.now();
	gameloop = setInterval(function() {
		gameLogic();
	}, 1000/60)
}

function initializeControlKeys(){
	document.getElementById('control-keys').innerHTML = `
	<div><button id="control-up">Up</button></div>
	<div id="middle-row"><button id="control-left">Left</button>
		 <button id="control-right">Right</button></div>
	<div><button id = "control-down">Down</button><div>`;

	leftButton = document.getElementById('control-left');
	upButton = document.getElementById('control-up');
	rightButton = document.getElementById('control-right');
	downButton = document.getElementById('control-down');

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


	//mouse click
	leftButton.addEventListener('mousedown', () => {
		command['LEFT'] = true;
	});
	
	leftButton.addEventListener('mouseup', () => {
		delete command['LEFT'];
	});
	
	upButton.addEventListener('mousedown', () => {
		command['UP'] = true;
	});
	
	upButton.addEventListener('mouseup', () => {
		delete command['UP'];
	});
	
	rightButton.addEventListener('mousedown', () => {
		command['RIGHT'] = true;
	});
	
	rightButton.addEventListener('mouseup', () => {
		delete command['RIGHT'];
	});
	
	downButton.addEventListener('mousedown', () => {
		command['DOWN'] = true;
	});
	
	downButton.addEventListener('mouseup', () => {
		delete command['DOWN'];
	});


	//touch

	leftButton.addEventListener('touchstart', () => {
		event.preventDefault();
		command['LEFT'] = true;
	});
	
	leftButton.addEventListener('touchend', () => {
		event.preventDefault();
		delete command['LEFT'];
	});
	
	upButton.addEventListener('touchstart', () => {
		event.preventDefault();
		command['UP'] = true;
	});
	
	upButton.addEventListener('touchend', () => {
		event.preventDefault();
		delete command['UP'];
	});
	
	rightButton.addEventListener('touchstart', () => {
		event.preventDefault();
		command['RIGHT'] = true;
	});
	
	rightButton.addEventListener('touchend', () => {
		event.preventDefault();
		delete command['RIGHT'];
	});
	
	downButton.addEventListener('touchstart', () => {
		event.preventDefault();
		command['DOWN'] = true;
	});
	
	downButton.addEventListener('touchend', () => {
		event.preventDefault();
		delete command['DOWN'];
	});
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
		if(collisionCheck(BOUNDING_RECT_OFFSET, -BOUNDING_RECT_OFFSET + 15, BOUNDING_RECT_SIZE, BOUNDING_RECT_SIZE)) {
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

// ----------------------------------------------------------------------------------------------------------------

// Touch Event Listeners
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchend', handleTouchEnd, false);

let xDown = null;
let yDown = null;

function handleTouchStart(e) {
    const firstTouch = e.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(e) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    // Check for the minimum threshold to trigger movement
    const minSwipeDistance = 20; // Adjust this value to your desired sensitivity

    if (Math.abs(xDiff) > minSwipeDistance || Math.abs(yDiff) > minSwipeDistance) {
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                // Swipe left
                command['LEFT'] = true;
            } else {
                // Swipe right
                command['RIGHT'] = true;
            }
        } else {
            if (yDiff > 0) {
                // Swipe up
                command['UP'] = true;
            } else {
                // Swipe down
                command['DOWN'] = true;
            }
        }
        // Reset starting point for the next swipe calculation
        xDown = null;
        yDown = null;
    }
}

function handleTouchEnd() {
    // Clear commands when touch ends
    delete command['LEFT'];
    delete command['RIGHT'];
    delete command['UP'];
    delete command['DOWN'];
    xDown = null;
    yDown = null;
}

