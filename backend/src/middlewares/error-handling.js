module.exports = (app) => {
    app.use((req, res, next) => { // if we are here, there was no route, so we send a 404
        res.status(404);
        throw new Error("Not found: " + req.url);
    });
    app.use((error, req, res, next) => { // handles every error which occurs in the express routes
        const status = res.statusCode || 500;

        res.status(status).json({
            message: error.message,
            stack: process.env.NODE_ENV === "PRODUCTION" ? undefined : error.stack
        });
    })
};
