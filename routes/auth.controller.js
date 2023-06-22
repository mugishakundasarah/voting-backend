const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { signupSchema, signinSchema } = require('../utils/Validation');

router.post('/signup', async (req, res) => {
  try {
    // Validate request body against signupSchema
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Check if the nationalId already exists in the database
    const existingCandidate = await Candidate.findOne({ nationalId: value.nationalId });
    if (existingCandidate) {
      return res.status(409).json({ error: 'National ID already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(value.password, 10);
    value.password = hashedPassword;

    // Create a new user instance with validated data
    const newUser = new User(value);

    // Save the new user in the database
    await newUser.save();

    // Respond with the saved user data
    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users',async (req, res) => {
  try {
    let users = await User.find()
    return res.status(200).json(users);
  } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ message: 'Internal server error' }); 
  }
})

// Sign in route
router.post('/signin', async (req, res) => {
  try {
    let {error,value} = signinSchema.validate(req.body)

    if(error) {
      return res.json({message: error.details[0].message, status: 404})
    }

    let email = value.email
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'Invalid username or password' , status: 401});
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid) {
      return res.json({ message: 'Invalid username or password', status: 401});
    }


    // Generate and sign a JWT token
    const token = jwt.sign({role: user.role} , process.env.JWT_SECRET_KEY, { expiresIn: '2d'});

    let LoggedInUser = {
      email: user.email,
    }

    return res.status(200).json({ token, user: LoggedInUser, status: 200 });
  } catch (error) {
    console.error('Error signing in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;