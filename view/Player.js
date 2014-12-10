var TILE_SIZE = 64;
var PLAYER_FRAME_RATE = 0.02;
var PLAYER_ASSET;
var PLAYER_ASSET_URL = 'assets/player.png';
var PLAYER_FACING_LEFT = 0;
var PLAYER_FACING_RIGHT = 1;
var PLAYER_FACING_UP = 2;
var PLAYER_FACING_DOWN = 3;
var PLAYER_NUM_OF_FRAME = 10;
var PLAYER_SPEED = 3;

function Sprite(graphics, asset, left, top, width, height) {
	this.graphics = graphics;
	this.asset = asset;
	this.top = top;
	this.left = left;
	this.width = width;
	this.height = height;
	this.frame;
}

Sprite.prototype.setFrame = function(src, left, top, width, height){
	var newFrame = {};
	newFrame['src'] = src;
	newFrame['left'] = left;
	newFrame['top'] = top;
	newFrame['width'] = width;
	newFrame['height'] = height;
	this.frame = newFrame;
}

Sprite.prototype.render = function() {
	this.graphics.drawImage(this.frame.src,
							this.frame.left,
							this.frame.top,
							this.frame.width,
							this.frame.height,
							this.left,
							this.top,
							this.width,
							this.height);
}

Sprite.prototype.setPosition = function(left, top) {
	this.left = left;
	this.top = top;
	this.speed;
}

function Player(sprite, left, top) {
	this.sprite = sprite;
	this.left = left;
	this.top = top;
	this.frame = {};
	this.isMoving = false;
	this.movingDelta = 0;
	this.state = PLAYER_FACING_DOWN;
}

Player.prototype.setMoving = function(state) {
	this.isMoving = true;
	this.state = state;
}

Player.prototype.stopMoving = function() {
	this.isMoving = false;
	this.movingDelta = 0;
}

Player.prototype.moveLeft = function() {
	this.left -= PLAYER_SPEED;
	this.setMoving(PLAYER_FACING_LEFT);
}

Player.prototype.moveRight = function() {
	this.left += PLAYER_SPEED;
	this.setMoving(PLAYER_FACING_RIGHT);
}

Player.prototype.moveUp = function() {
	this.top -= PLAYER_SPEED;
	this.setMoving(PLAYER_FACING_UP);
}

Player.prototype.moveDown = function() {
	this.top += PLAYER_SPEED;
	this.setMoving(PLAYER_FACING_DOWN);
}

Player.prototype.render = function() {
	this.frameLogic();
	this.sprite.setPosition(this.left, this.top);
	this.sprite.render();
}

Player.prototype.frameLogic = function() {
	if(this.isMoving){
		var frame = Math.floor(this.movingDelta * PLAYER_NUM_OF_FRAME);
		if(this.state == PLAYER_FACING_DOWN) {
			this.sprite.setFrame(this.sprite.asset, (120 * frame), 520, 120, 130);
		} else if(this.state == PLAYER_FACING_LEFT) {
			this.sprite.setFrame(this.sprite.asset, (120 * frame), 650, 120, 130);
		} else if(this.state == PLAYER_FACING_UP) {
			this.sprite.setFrame(this.sprite.asset, (120 * frame), 780, 120, 130);
		} else if (this.state == PLAYER_FACING_RIGHT) {
			this.sprite.setFrame(this.sprite.asset, (120 * frame), 910, 120, 130);
		}
		this.movingDelta += PLAYER_FRAME_RATE;
		if(this.movingDelta >= 1) this.movingDelta = 0;
	} else {
		if(this.state == PLAYER_FACING_DOWN) {
			this.sprite.setFrame(this.sprite.asset, 0, 0, 120, 130);
		} else if(this.state == PLAYER_FACING_LEFT) {
			this.sprite.setFrame(this.sprite.asset, 0, 130, 120, 130);
		} else if(this.state == PLAYER_FACING_UP) {
			this.sprite.setFrame(this.sprite.asset, 0, 260, 120, 130);
		} else if (this.state == PLAYER_FACING_RIGHT) {
			this.sprite.setFrame(this.sprite.asset, 0, 390, 120, 130);
		}
	}
}


///testing

var command = {};
var player;
var display;
var gameloop;
var assetManager;
document.addEventListener('DOMContentLoaded', function(){
	display = document.getElementById('display');
	assetManager = new AssetManager();
	assetManager.pushAssetURL(PLAYER_ASSET_URL);
	assetManager.setCompletionHandler(startTest);
	assetManager.downloadAssets();

});

function startTest() {
	PLAYER_ASSET = assetManager.getAsset(PLAYER_ASSET_URL);
	player = new Player(new Sprite(display.getContext('2d'), PLAYER_ASSET, 100, 100, TILE_SIZE, TILE_SIZE), 100, 100);
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
	gameloop = setInterval(function() {
		commandHandler();
		render();
	}, 1000/60)
}

function commandHandler() {
	var notMoving = true;
	if(command['UP']) {
		notMoving = false;
		player.moveUp();
	}
	if(command['DOWN']) {
		notMoving = false;
		player.moveDown();
	}
	if(command['RIGHT']) {
		notMoving = false;
		player.moveRight();
	}
	if(command['LEFT']) {
		notMoving = false;
		player.moveLeft();
	}
	if(notMoving) {
		player.stopMoving();
	}
}

function render(){
	display.getContext('2d').clearRect(0, 0, 1024, 640);
	player.render();
}