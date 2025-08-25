import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // adjust the path if needed
export default async (req, res, next) => {
    let token = req.get('Authorization');
    if (token) {
        token = token.split(' ')[1]; // remove 'Bearer '
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                req.user = null;
                req.exp = null;
                return next();
            }
            try {
                // Fetch user from DB to ensure role is up to date
                const user = await User.findById(decoded.user._id).select('-password');
                if (!user) {
                    req.user = null;
                    req.exp = null;
                } else {
                    req.user = user; // includes role, name, email, etc.
                    req.exp = new Date(decoded.exp * 1000);
                }
            } catch (dbErr) {
                req.user = null;
                req.exp = null;
            }
            return next();
        });
    } else {
        req.user = null;
        next();
    }
};