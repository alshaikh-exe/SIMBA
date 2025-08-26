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
            // Auto-generate adminId
            const lastAdmin = await User.find({ role: 'admin' }).sort({ createdAt: -1 }).limit(1);
            const lastId = lastAdmin[0]?.adminId || 'AD000';
            const nextIdNumber = String(parseInt(lastId.replace('AD', '')) + 1).padStart(3, '0');
            userData.adminId = `AD${nextIdNumber}`;

            // Other admin fields
            userData.profilePicture = body.profilePicture;
            userData.adminCampus = body.adminCampus;
            userData.adminOfficeHours = body.adminOfficeHours;
            userData.adminAvailability = body.adminAvailability;
        } else if (role === 'user') {
            // Auto-generate studentId
            const year = new Date().getFullYear();
            const lastStudent = await User.find({ role: 'user', studentId: { $regex: `^${year}` } })
                                          .sort({ createdAt: -1 }).limit(1);
            const lastId = lastStudent[0]?.studentId || `${year}0000`;
            const nextIdNumber = String(parseInt(lastId.slice(4)) + 1).padStart(4, '0');
            userData.studentId = `${year}${nextIdNumber}`;

            // Other user fields
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
}
,
    async login(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) throw new Error()
            const match = await bcrypt.compare(req.body.password, user.password)
            if (!match) throw new Error()
            res.locals.data.user = user
            res.locals.data.token = createJWT(user)
            next()
        } catch {
            res.status(400).json('Bad Credentials')
        }
    }
}

const apiController = {
    auth(req, res) {
        res.json({
            token: res.locals.data.token,
            user: res.locals.data.user
        })
    }
}

export {
    checkToken,
    dataController,
    apiController
}

/* -- Helper Functions -- */

function createJWT(user) {
  // Common fields for both roles
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture || ""
  };

  // Add admin-specific fields
  if (user.role === 'admin') {
    payload.adminCampus = user.adminCampus;
    payload.adminOfficeHours = user.adminOfficeHours;
    payload.adminAvailability = user.adminAvailability;
  }

  // Add user-specific fields
  if (user.role === 'user') {
    payload.studentId = user.studentId;
    payload.academicYear = user.academicYear;
    payload.major = user.major;
    payload.age = user.age;
  }

  return jwt.sign(
    { user: payload },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}