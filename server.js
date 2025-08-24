import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Then import other modules that need environment variables
import './config/db.js';
import app from './app-server.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('We in the building on ' + PORT)
})