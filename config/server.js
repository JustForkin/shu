config = module.exports;

config.express = {
	port : process.env.PORT || 3000,
	ip   : '127.0.0.1'
};

config.PRODUCTION = process.env.NODE_ENV === 'production';

config.URLS_DATA_PATH = 'urls.json';
config.BUCKET         = 'xurl-fluuuid';
config.BUCKET_URL     = 'https://s3-eu-west-1.amazonaws.com/xurl-fluuuid';

config.REMOTE_URL = 'http://x.fluuu.id';
config.BASE_URL   = config.PRODUCTION ? config.REMOTE_URL : 'http://'+config.express.ip+':'+config.express.port;

config.shortlinks = {
	SALT     : 'I AM THE SALT, HEAR ME ROAR',
	ALPHABET : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
};
