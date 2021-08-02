const checkApiKey = (mode) => (req, res, next) => {

    const isValid = (key) => {
        if (key === process.env.ADMIN_API_KEY) {
            return true;
        }
        if (key === process.env.API_KEY && mode !== 'admin') {
            return true;
        }
        if (!process.env.API_KEY && !process.env.ADMIN_API_KEY) {
            return true
        }
        return false;
    }

    if (!isValid(req.header('X-API-Key'))) {
        return res.status(401).json({status: 'Unauthorized'});
    }
    next();
};

module.exports = checkApiKey;
