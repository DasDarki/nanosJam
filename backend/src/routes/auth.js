const express = require("express");
const router = express.Router();

const crypto = require("crypto");
const jwt = require("../utils/jwt");
const database = require("../services/database");

const DiscordOauth2 = require("discord-oauth2");
const {isTester} = require("../services/bot");
const states = []; // The states array stores the state of the OAuth2 flow in combination with the user's ip address.

const oauth = new DiscordOauth2({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: process.env.DOMAIN + "/auth/callback"
});

router.get("/", (req, res) => { // generates an oauth2 discord authorization url and redirects the user to it
    const state = generateState();
    states.push({
        state,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });

    res.redirect(oauth.generateAuthUrl({scope: ["identify"], state}));
});

router.get("/callback", async (req, res) => { // here the user will land after successfully authenticating with discord
    const {query} = req;
    const {state} = query;
    const {code} = query;
    const stateObj = states.find(s => s.state === state);
    if (!stateObj) {
        res.status(400).send("Invalid state");
        return;
    }

    const {ip} = stateObj;
    states.splice(states.findIndex(s => s.state === state), 1);

    if (ip !== (req.headers['x-forwarded-for'] || req.socket.remoteAddress) || !code) {
        res.redirect(process.env.REDIRECT_URL + "/");
        return;
    }

    const {access_token} = await oauth.tokenRequest({code, scope: ["identify"], grantType: "authorization_code"});
    const user = await oauth.getUser(access_token);
    const {id, avatar, username, discriminator} = user;

    if (!await isTester(id)) {
        res.redirect(process.env.REDIRECT_URL + "/");
        return;
    }

    const [rows] = await database.execute("SELECT `id` FROM `users` WHERE `id` = ?", [id]);
    if (rows.length <= 0) { // check if the user is already in the database if not, create a new user
        await database.execute("INSERT INTO `users` (`id`, `username`, `avatar`) VALUES (?, ?, ?)", [id, `${username}#${discriminator}`, avatar]);
    }

    const atk = await jwt.generateJwt(id);
    res.cookie("nanosJam_ATK", atk, { // set a cookie with the user's access token as secure http only cookie
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    });

    res.redirect(process.env.REDIRECT_URL + "/dashboard");
});



function generateState() { // generates a random state which will be passed to the discord oauth2 flow
    let state = crypto.randomBytes(20).toString("hex");
    while (states.find(s => s.state === state)) {
        state = crypto.randomBytes(20).toString("hex");
    }
    return state;
}

module.exports = router;
