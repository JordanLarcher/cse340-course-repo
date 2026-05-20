import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import { testConnection } from "./src/models/db.js";
import router from './src/routes/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';


const app = express();


/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));


app.use((req, res, next) => {
    if(NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware to make NODE_ENV available to all templates via res.locals
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});


app.use(router);


app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    // Log error details for debugging purposes
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    // Determine the status code to send in the response
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    // Prepare data for the template
    const context = { 
        title: status === 404 ? 'Page Not Found' : 'Internal Server Error',
        error: err.message,
        stack: err.stack
    };

    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
});

app.listen(process.env.PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${process.env.PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    }catch (error) {
        console.log('Error connecting to the database server', error);
    }
});
