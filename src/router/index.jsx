import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    let token = req.get('Authorization');
    if (token) {
        token = token.split(' ')[1]; // remove 'Bearer '
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            req.user = err ? null : decoded.user; // must set req.user
            req.exp = err ? null : new Date(decoded.exp * 1000);
        });
    } else {
        req.user = null;
    }
    next();
};
