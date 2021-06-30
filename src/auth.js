const checkApiKey = function(req, res, next) {
    const apiKey = process.env.API_KEY || 'test123';
    if (req.header('X-API-Key') !== apiKey) {
        return res.status(401).json({status: 'Unauthorized'});
    }
    next();
};

module.exports = checkApiKey;
