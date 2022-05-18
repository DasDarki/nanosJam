const express = require("express");
const router = express.Router();

const database = require("../services/database");

router.get("/", async (req, res) => {
    const [rows] = await database.execute("SELECT * FROM `events` WHERE `goes_until` > NOW() ORDER BY ABS(DATEDIFF(`scheduled_at`, NOW())) LIMIT 1");

    if (rows.length > 0) {
        const row = rows[0];

        const { id, scheduled_at, submission_goes_until, goes_until, teams_allowed, results_shown } = row;
        let { theme } = row;

        if (scheduled_at > new Date()) {
            theme = undefined;
        }

        res.json({
            id,
            theme,
            scheduledAt: scheduled_at,
            submissionGoesUntil: submission_goes_until,
            goesUntil: goes_until,
            teamsAllowed: teams_allowed,
            resultsShown: results_shown,
            _dates: [
                'scheduledAt', 'submissionGoesUntil', 'goesUntil'
            ]
        })
    } else {
        res.status(404).send("No events found");
    }
});

router.get("/list", async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        res.status(403).send("Forbidden");
        return;
    }

    const [rows] = await database.execute("SELECT `id`, `scheduled_at` FROM `events` ORDER BY `scheduled_at` DESC");

    res.json(rows.map(row => ({
        id: row.id,
        scheduledAt: row.scheduled_at,
        _dates: [
            'scheduledAt'
        ]
    })));
});

router.get("/:id", async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        res.status(403).send("Forbidden");
        return;
    }

    const { id } = req.params;
    const [rows] = await database.execute("SELECT * FROM `events` WHERE `id` = ?", [id]);

    if (rows.length > 0) {
        const row = rows[0];

        const { id, scheduled_at, submission_goes_until, goes_until, teams_allowed, results_shown, theme } = row;

        res.json({
            id,
            theme,
            scheduledAt: scheduled_at,
            submissionGoesUntil: submission_goes_until,
            goesUntil: goes_until,
            teamsAllowed: teams_allowed,
            resultsShown: results_shown,
            _dates: [
                'scheduledAt', 'submissionGoesUntil', 'goesUntil'
            ]
        })
    } else {
        res.status(404).send(`The event with id ${id} was not found`);
    }
});

router.post("/", async (req, res) => {
    const { theme, scheduledAt, goesUntil, teamsAllowed, submissionGoesUntil } = req.body;

    const [rows] = await database.execute("INSERT INTO `events` (`theme`, `scheduled_at`, `goes_until`, `teams_allowed`, `submission_goes_until`) VALUES (?, ?, ?, ?, ?)", [theme, scheduledAt, goesUntil, teamsAllowed, submissionGoesUntil]);

    res.json({
        id: rows.insertId,
        theme,
        scheduledAt,
        submissionGoesUntil,
        goesUntil,
        teamsAllowed,
        resultsShown: false,
        _dates: [
            'scheduledAt', 'submissionGoesUntil', 'goesUntil'
        ]
    });
});

router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { theme, scheduledAt, goesUntil, teamsAllowed, submissionGoesUntil } = req.body;

    const [rows] = await database.execute("UPDATE `events` SET `theme` = ?, `scheduled_at` = ?, `goes_until` = ?, `teams_allowed` = ?, `submission_goes_until` = ? WHERE `id` = ?", [theme, scheduledAt, goesUntil, teamsAllowed, submissionGoesUntil, id]);

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
