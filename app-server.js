import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

//Add your api route imports here
import checkToken from './config/checkToken.js';
import userRoutes from './routes/api/users.js';
import adminRoutes from './routes/api/admin.js'
import roleRoutes from './routes/api/roleRoutes.js';
const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.locals.data = {}
    next()
})

// API Routes - these must come before the static file serving
app.use('/api/users', userRoutes);
app.use('/api/users', adminRoutes)
app.use('/api/roles', roleRoutes);

// Determine which directory to serve static files from
const staticDir = process.env.NODE_ENV === 'production' ? 'dist' : 'public';
const indexPath = process.env.NODE_ENV === 'production' ? 'dist/index.html' : 'index.html';

// Serve static files from the appropriate directory
app.use(express.static(staticDir));

// For React Router - serve index.html for all non-API routes
app.get(/.*/, (req, res) => {
    // Serve the React app for all other routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.resolve(path.join(__dirname, indexPath)));
});

export default app;