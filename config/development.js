const port = process.env.PORT || 3000;
const apiBaseUrl = process.env.API_BASE_URL;

module.exports = {
    client: {
        type: 'development-client',
        env: process.env.NODE_ENV,
    },
    server: {
        type: 'development-server',
        env: process.env.NODE_ENV,
        port,
        apiBaseUrl,
    },
};
