config = module.exports

config.express =
	port : process.env.PORT or 3000
	ip   : "127.0.0.1"

config.express_preview =
	port : process.env.PORT or 3001
	ip   : "127.0.0.1"

config.PRODUCTION = process.env.NODE_ENV is "production"

config.URLS_DATA_PATH = '/data/urls.json'
config.BUCKET         = 'xurl-fluuuid'
config.BUCKET_URL     = 'https://s3-eu-west-1.amazonaws.com/xurl-fluuuid'

config.BASE_URL = if config.PRODUCTION then "prod" else "http://#{config.express.ip}:#{config.express.port}"

config.shortlinks =
	SALT     : 'I AM THE SALT, HEAR ME ROAR'
	ALPHABET : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
