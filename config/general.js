config = module.exports;

config.express = {
	port : process.env.PORT || 3000,
	ip   : '127.0.0.1'
};

config.PRODUCTION = process.env.NODE_ENV === 'production';

config.URLS_DATA_PATH = 'urls.json';

config.shortlinks = {
	SALT     : 'I AM THE SALT, HEAR ME ROAR',
	ALPHABET : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
};
