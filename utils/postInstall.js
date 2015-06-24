#!/usr/bin/env node

var fs = require('fs');

function enableUrlDirWrite() {
	var dirToEnable = 'data/';
	fs.chmodSync(dirToEnable, 0777);
	console.log('Dir %s now writable', dirToEnable);
}

enableUrlDirWrite();
