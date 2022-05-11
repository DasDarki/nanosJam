const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    if (req.user) {
        return res.json(req.user);
    }

    return res.status(401).json({
        message: "Unauthorized"
    });
});

module.exports = router;
