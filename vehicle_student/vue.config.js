module.exports = {
	    devServer: {
		            host: '127.0.0.1',
		            port: 8081,
		            public: 'localhost:8081',
		            watchOptions: {
				              ignored: ['node_modules'],
				              aggregateTimeout: 300,
				              poll: 1500
				            }
		        },
	    "transpileDependencies": [
		            "vuetify"
		        ]
}
