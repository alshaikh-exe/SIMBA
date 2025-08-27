import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const SALT_ROUNDS = 6;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 3,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'], // keep this for your routes
        default: 'user'
    },
    profilePicture: { type: String, default: '' }, // added for all users
    // Admin-specific fields
    adminId: { type: String, unique: true, sparse: true }, // e.g., AD001
    adminCampus: { type: String }, // free-form: A, B, C, etc.
    adminOfficeHours: { type: String }, // e.g., "9am-9pm"
    adminAvailability: { type: Boolean, default: false },

    // User-specific fields
    studentId: { type: String, unique: true, sparse: true }, // e.g., 20230001
    academicYear: { type: String }, // e.g., "2023"
    major: { type: String }, // e.g., software, electrical, mechanical
    age: { type: Number }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password; // never expose password
            return ret;
        }
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    return next();
});

export default mongoose.model('User', userSchema);