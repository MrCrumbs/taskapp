module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        public: 'localhost:8080',
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