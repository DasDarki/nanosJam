const express = require("express");
const router = express.Router();

const database = require("../services/database");

router.get("/", async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        res.status(403).send("Forbidden");
        return;
    }

    const [rows] = await database.execute("SELECT * FROM `events` ORDER BY `scheduled_at` DESC");
    const results = [];

    for (const row of rows) {
        const { id, scheduled_at, submission_goes_until, goes_until, teams_allowed, results_shown, theme } = row;

        results.push({
            id,
            theme,
            scheduledAt: scheduled_at,
            submissionGoesUntil: submission_goes_until,
            goesUntil: goes_until,
            teamsAllowed: teams_allowed,
            resultsShown: results_shown
        })
    }

    res.json(results);
});

module.exports = router;
