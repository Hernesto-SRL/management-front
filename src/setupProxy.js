const { createProxyMiddleware } = require('http-proxy-middleware');

const onError = (err, req, resp, target) => {
    console.error(`${err.message}`);
}

module.exports = function (app) {
    const appProxy = createProxyMiddleware(['/api'],  {
        target: 'https://localhost:7012',
        onError: onError,
        secure: false,
        changeOrigin: true,
        headers: {
            Connection: 'Keep-Alive'
        }
    });

    app.use(appProxy);
};
