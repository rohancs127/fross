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
							this.top-5,
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

Player.prototype.setPosition = function(left, top) {
	this.left = left;
	this.top = top;
}

Player.prototype.fallDown = function() {
	this.sprite.graphics.fillStyle = "rgba(240,0,0,0.3)";
	this.sprite.graphics.fillRect(this.left, this.top, TILE_SIZE, TILE_SIZE);
}