const database = require("../services/database");
const {decodeJwt} = require("../utils/jwt");

module.exports = async (req, res, next) => {
    try {
        const atk = req.cookies.nanosJam_ATK;

        if (!atk) {
            next();
            return;
        }

        const id = await decodeJwt(atk);
        const [rows] = await database.execute("SELECT `username`, `avatar`, `is_admin` FROM `users` WHERE `id` = ?", [id]);

        if (rows.length > 0) {
            const row = rows[0];

            req.user = {
                id,
                username: row.username,
                avatar: `https://cdn.discordapp.com/avatars/${id}/${row["avatar"]}`,
                isAdmin: row["is_admin"]
            };
        }
    } catch (e) {
        console.error(e);
    }

    next();
};
