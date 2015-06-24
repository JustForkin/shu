#!/usr/bin/env node

var fs = require('fs');
var s3 = require('s3');

var config_general = require('../config/general');
var config_user    = require('../config/user');

function getUploadParamsSingle(localFile, remoteFilePath, bucket) {

    var params = {
        localFile: localFile,
        s3Params: {
            Bucket: bucket,
            Key: remoteFilePath
        }
    };

    console.log("params", params);

    return params;
}

function getClient(creds) {
    var client = s3.createClient({
        maxAsyncS3: 20,     // this is the default
        s3RetryCount: 3,    // this is the default
        s3RetryDelay: 1000, // this is the default
        multipartUploadThreshold: 20971520, // this is the default (20 MB)
        multipartUploadSize: 15728640, // this is the default (15 MB)
        s3Options: {
            accessKeyId: creds.id,
            secretAccessKey: creds.key,
            region : creds.region
            // any other options are passed to new AWS.S3()
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
        },
    });

    return client;
}

function startUploader(method, client, params, cb) {
    console.log('\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n');
    console.log('UPLOADING TO BUCKET '+params.s3Params.Bucket);
    console.log('\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n');

    var uploader = client[method](params);
    uploader.on('error', function(err) {
        console.error("unable to sync:", err.stack);
    });
    uploader.on('progress', function() {
        console.log("progress", uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on('end', function() {
        console.log("done uploading");
        if (typeof cb === 'function') {
            cb();
        }
    });
}

function uploadSingleFile(filePath, cb) {
    var creds, client, uploadParams;

    creds        = config_user.CREDENTIALS;
    client       = getClient(creds);
    uploadParams = getUploadParamsSingle(filePath, config_general.URLS_DATA_PATH, config_user.BUCKET);

    startUploader('uploadFile', client, uploadParams, cb);
}

module.exports = {
    uploadSingleFile : uploadSingleFile
};
