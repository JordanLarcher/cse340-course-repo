import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import { testConnection } from "./src/models/db.js";
import router from './src/routes/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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

app.use(router);

app.listen(process.env.PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${process.env.PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    }catch (error) {
        console.log('Error connecting to the database server', error);
    }
});
