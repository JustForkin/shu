// this file is removed from version control

config = module.exports;

config.BUCKET     = process.env.BUCKET || 'add-your-bucket-name';
config.BUCKET_URL = process.env.BUCKET_URL || 'add-your-full-bucket-url-here';
config.REMOTE_URL = process.env.REMOTE_URL || 'add-your-app-url-here';

config.CREDENTIALS = {
	id     : "aws-id-with-access-to-s3-bucket",
	key    : "aws-key-with-access-to-s3-bucket",
	region : "aws-region-for-user"
};
