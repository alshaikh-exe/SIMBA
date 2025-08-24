import dotenv from 'dotenv'
import mongoose from 'mongoose';
dotenv.config()
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('connected', function () {
    console.log(`Connected to MongoDB at ${db.host}:${db.port} The database name is ${db.name}`);
});

db.on('error', function (err) {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', function () {
    console.log('MongoDB disconnected');
});