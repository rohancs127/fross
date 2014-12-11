function AssetManager() {
	this.cache = {};
	this.assetQueue = [];
	this.processed = 0;
	this.completionHandler = {};
	this.downloadedHandler = {};
}

AssetManager.prototype.pushAssetURL = function(url) {
	this.assetQueue.push(url);
}

AssetManager.prototype.downloadAssets = function() {
	manager = this;
	this.numOfAssets = this.assetQueue.length;
	if(this.assetQueue.length === 0) {
		this.uponCompletionHandler();
		return;
	}
	for (var i = 0; i < this.assetQueue.length; ++i) {
		var curImg = new Image();
		var url = this.assetQueue[i];
		curImg.addEventListener('error', function() {
			++manager.processed;
			manager.downloadedHandler();
		});
		curImg.addEventListener('load', function() {
			++manager.processed;
			manager.downloadedHandler();
			if(manager.processed === manager.numOfAssets) {
				manager.uponCompletionHandler();
			}
		});
		curImg.src = url;
		this.cache[url] = {'asset' : curImg};
	}
}

AssetManager.prototype.setDownloadedHandler = function(fn) {
	this.downloadedHandler = fn;
}

AssetManager.prototype.setCompletionHandler = function(fn) {
	this.completionHandler = fn;
}

AssetManager.prototype.uponCompletionHandler = function() {
	this.completionHandler();
}

AssetManager.prototype.getAsset = function(url) {
	return this.cache[url].asset;
}