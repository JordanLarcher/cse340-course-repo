import bcrypt from 'bcrypt';
import {createUser, getUserByEmail, authenticateUser} from '../models/users.js';



const showUserRegistrationForm = (req, res) => {

    res.render('register', { title: 'Register' });
}

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {

        // hash the password before storing it in the database
        const saltRounds = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'User registered successfully.');
        return res.redirect('/');
    }
    catch (error) {
        console.error('Error during user registration:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        return res.redirect('/register');
    }
}

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
}

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Set user session or token here (not implemented in this example)
        req.session.user = user; // Example of setting user session
        req.flash('success', 'Logged in successfully.');

        if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
        }
        return res.redirect('/dashboard');
    }
    catch (error) {
        console.error('Error during user login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        return res.redirect('/login');
    }
}

const processLogout = async (req, res) => {
    if(req.session.user){
        delete req.session.user; // Clear user session
        req.flash('success', 'Logged out successfully.');
    }
    return res.redirect('/');
}

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }
    next(); 
}

const showDashboard = (req, res) => {
    const user = req.session.user; // Assuming user info is stored in session  

    res.render('dashboard', { title: 'Dashboard', name: user.name, email: user.email });
}

export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard };