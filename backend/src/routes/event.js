const express = require("express");
const router = express.Router();

const database = require("../services/database");

router.get("/", async (req, res) => {
    const [rows] = await database.execute("SELECT * FROM `events` WHERE `goes_until` > NOW() ORDER BY ABS(DATEDIFF(`scheduled_at`, NOW())) LIMIT 1");

    if (rows.length > 0) {
        const row = rows[0];

        const { id, scheduled_at, goes_until, teams_allowed } = row;
        let { theme } = row;

        if (scheduled_at > new Date()) {
            theme = undefined;
        }

        res.json({
            id,
            theme,
            scheduledAt: scheduled_at,
            goesUntil: goes_until,
            teamsAllowed: teams_allowed
        })
    } else {
        res.status(404).send("No events found");
    }
});

router.post("/", async (req, res) => {
    const { theme, scheduledAt, goesUntil, teamsAllowed } = req.body;

    const [rows] = await database.execute("INSERT INTO `events` (`theme`, `scheduled_at`, `goes_until`, `teams_allowed`) VALUES (?, ?, ?, ?)", [theme, scheduledAt, goesUntil, teamsAllowed]);

    res.json({
        id: rows.insertId
    });
});

router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { theme, scheduledAt, goesUntil, teamsAllowed } = req.body;

    const [rows] = await database.execute("UPDATE `events` SET `theme` = ?, `scheduled_at` = ?, `goes_until` = ?, `teams_allowed` = ? WHERE `id` = ?", [theme, scheduledAt, goesUntil, teamsAllowed, id]);

    res.json({
        sucess: rows.affectedRows > 0
    });
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const [rows] = await database.execute("DELETE FROM `events` WHERE `id` = ?", [id]);

    res.json({
        success: rows.affectedRows > 0
    });
});

module.exports = router;
