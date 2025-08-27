import User from '../../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const checkToken = (req, res) => {
    console.log('req.user', req.user)
    res.json(req.exp)
}

const dataController = {
    async create(req, res, next) {
        try {
            const { role, ...body } = req.body;

            let userData = {
                name: body.name,
                email: body.email,
                password: body.password,
                role
            };

            if (role === 'admin') {
                const lastAdmin = await User.find({ role: 'admin' }).sort({ createdAt: -1 }).limit(1);
                const lastId = lastAdmin[0]?.adminId || 'AD000';
                const nextIdNumber = String(parseInt(lastId.replace('AD', '')) + 1).padStart(3, '0');
                userData.adminId = `AD${nextIdNumber}`;

                userData.profilePicture = body.profilePicture;
                userData.adminCampus = body.adminCampus;
                userData.adminOfficeHours = body.adminOfficeHours;
                userData.adminAvailability = body.adminAvailability || false;
            } else if (role === 'user') {
                const year = new Date().getFullYear();
                const lastStudent = await User.find({ role: 'user', studentId: { $regex: `^${year}` } })
                    .sort({ createdAt: -1 }).limit(1);
                const lastId = lastStudent[0]?.studentId || `${year}0000`;
                const nextIdNumber = String(parseInt(lastId.slice(4)) + 1).padStart(4, '0');
                userData.studentId = `${year}${nextIdNumber}`;

                userData.profilePicture = body.profilePicture;
                userData.academicYear = body.academicYear;
                userData.major = body.major;
                userData.age = body.age;
            }

            const user = await User.create(userData);
            const token = createJWT(user);

            res.locals.data.user = user;
            res.locals.data.token = token;
            next();
        } catch (e) {
            console.log('Database problem:', e);
            res.status(400).json(e);
        }
    },

    async login(req, res, next) {
        try {
            const { email, password, role } = req.body;
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found');

            const match = await bcrypt.compare(password, user.password);
            if (!match) throw new Error('Incorrect password');

            if (role && user.role !== role) {
                return res.status(403).json({ error: "Access denied: incorrect role" });
            }

            res.locals.data.user = user;
            res.locals.data.token = createJWT(user);
            next();
        } catch (err) {
            res.status(400).json({ error: 'Bad Credentials' });
        }
    },

    // NEW: Fetch current admin profile
    async getProfile(req, res, next) {
        try {
            const admin = await User.findById(req.user._id).select('-password');
            if (!admin) return res.status(404).json({ msg: 'Admin not found' });

            res.locals.data.admin = admin;
            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // NEW: Update availability
    async updateAvailability(req, res, next) {
        try {
            const adminId = req.user._id;
            const { availability } = req.body;

            const admin = await User.findByIdAndUpdate(
                adminId,
                { adminAvailability: availability },
                { new: true, runValidators: true }
            ).select('-password');

            if (!admin) return res.status(404).json({ msg: 'Admin not found' });

            res.locals.data.admin = admin;
            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server error' });
        }
    }
}

const apiController = {
    auth(req, res) {
        res.json({
            token: res.locals.data.token,
            user: res.locals.data.user
        })
    },

    // NEW: send admin profile
    sendAdminProfile(req, res) {
        res.json(res.locals.data.admin);
    }
}

/* -- Helper Functions -- */
function createJWT(user) {
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || ""
    };

    if (user.role === 'admin') {
        payload.adminCampus = user.adminCampus;
        payload.adminOfficeHours = user.adminOfficeHours;
        payload.adminAvailability = user.adminAvailability;
    }

    if (user.role === 'user') {
        payload.studentId = user.studentId;
        payload.academicYear = user.academicYear;
        payload.major = user.major;
        payload.age = user.age;
    }

    return jwt.sign({ user: payload }, process.env.SECRET, { expiresIn: '24h' });
}

export {
    checkToken,
    dataController,
    apiController
};