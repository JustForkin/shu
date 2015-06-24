#!/usr/bin/env node

var fs = require('fs');

function enableUrlDirWrite() {
	fs.chmodSync('data/', 0777);
}

enableUrlDirWrite();
