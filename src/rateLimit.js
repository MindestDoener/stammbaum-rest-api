const RateLimit = require("express-rate-limit");

// What to do when our maximum request rate is breached
const limitReached = (req, res) => {
    console.warn({ip: req.ip}, 'Rate limiter triggered');
    res.status(501).send('rate limit reached');
}// Options for our rate limiter
const options = {
    windowMs: 60000, // 1 minute
    max: 50, // times one ip can call endpoint in windowMS time
    onLimitReached: limitReached, // called once when max is reached
    handler: limitReached, // called for each subsequent request once max is reached
}

module.exports = RateLimit(options)
