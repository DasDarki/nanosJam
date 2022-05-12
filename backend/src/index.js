require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

const database = require("./services/database");
const bot = require("./services/bot");

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ALLOWED_ORIGINS
}));

// this is for the authentication of the user
app.use(require("./middlewares/auth"));

// here the routes will be added to the app
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));

// this middleware must be at the end of the chain
require("./middlewares/error-handling")(app);

async function start() {
    // the following lines make sure that the database is connected and all tables are created - if they don't exist
    await database.query("CREATE TABLE IF NOT EXISTS `users` (`id` bigint primary key, `username` varchar(255), `avatar` text, `is_admin` tinyint(1) default 0)");
    await database.query("CREATE TABLE IF NOT EXISTS `events` (`id` int primary key auto_increment, `scheduled_at` datetime, `goes_until` datetime, `theme` varchar(255), `teams_allowed` tinyint(1))");

    // the following line makes sure that the bot is connected
    await bot.startBot();

    app.listen(process.env.EXPRESS_PORT, () => {
        console.log(`Server is running on port ${process.env.EXPRESS_PORT}`);
    });
}

// bootstraps the server wraping the start function in an async function and executing it immediately
(async () => await start())();
