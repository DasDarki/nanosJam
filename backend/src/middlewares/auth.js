const database = require("../services/database");
const {decodeJwt} = require("../utils/jwt");

const User = require("../models/user");

module.exports = async (req, res, next) => {
    try {
        const atk = req.cookies.nanosJam_ATK;

        if (!atk) {
            next();
            return;
        }

        const id = await decodeJwt(atk);
        const [rows] = await database.execute("SELECT `username`, `avatar` FROM `users` WHERE `id` = ?", [id]);

        if (rows.length > 0) {
            const row = rows[0];

            req.user = new User(id, row["username"], row["avatar"]);
        }
    } catch (e) {
        console.error(e);
    }

    next();
};
