const jwt = require("jsonwebtoken");

function generateJwt(id) {
    const payload = {id};
    const secret = process.env.SECRET;

    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, {expiresIn: "1d"}, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

function decodeJwt(token) {
    const secret = process.env.SECRET;

    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded.id);
            }
        });
    });
}

module.exports = {
    generateJwt, decodeJwt
}
