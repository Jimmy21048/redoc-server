const { verify } = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if(!accessToken) {
        return res.json({error: "Oops! you are not logged in"})
    }

    try {
        const validToken = verify(accessToken, process.env.JWT_SIGN);
        req.user = validToken.username;

        if(validToken) {
            next();
        } else {
            return res.json({error: "You are not logged in"});
        }
    }catch(err) {
        console.log(err);
        return res.json({error: "sorry, an error occurred"});
    }
}

module.exports = { validateToken }