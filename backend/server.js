const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (make sure to replace with your connection string)
mongoose.connect('mongodb://localhost:27017/chess_app', { useNewUrlParser: true, useUnifiedTopology: true });

// User model (replace with your actual user schema)
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}));

// Server health check
app.get('/', (req, res) => {
    res.send('Server is running');
});

// User data retrieval
app.get('/api/user', (req, res) => {
    const user = { name: 'John Doe', gamesPlayed: 100, rank: 'Grandmaster' };
    res.json(user); // Return data to frontend
});

// User data retrieval endpoint
app.get('/api/user/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user); // Return user data
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    console.log(username, password);

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // If user is found and password matches, return user data (omit password for security)
        const userData = {
            username: user.username,
            // Add other user fields as needed
        };
        console.log(userData);
        res.json(userData);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

///

// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Connect Database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Define Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/profile', require('./routes/profile'));

// const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// app.get('/', (req, res) => {
//     res.send('Server is running');
//   });

//   app.get('/api/user', (req, res) => {
//     // Some code to retrieve user data from MongoDB
//     const user = { name: 'John Doe', gamesPlayed: 100, rank: 'Grandmaster' };
//     res.json(user); // Return data to frontend
//   });

//////

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json()); // To parse JSON data

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('MongoDB connected successfully');
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });

// // Routes
// app.use('/api/users', require('./routes/userRoutes'));

// // Sample route to fetch user data by username
// app.get('/api/users/:username', async (req, res) => {
//     const { username } = req.params;
//     try {
//       const user = await User.findOne({ username: username });
//       if (user) {
//         res.json(user);
//       } else {
//         res.status(404).json({ message: 'User not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching user', error });
//     }
//   });

// // Start server
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });