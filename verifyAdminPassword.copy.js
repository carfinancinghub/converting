const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:admin123@127.0.0.1:27017/car-haul?authSource=admin';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const verifyAdminPassword = async () => {
  try {
    const email = 'admin@example.com';
    const password = 'admin123';

    // Find the admin user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Admin user not found.');
      return;
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log('Password matches! You can log in with admin@example.com and admin123.');
    } else {
      console.log('Password does not match. The stored hashed password does not correspond to "admin123".');
    }
  } catch (err) {
    console.error('Error verifying password:', err);
  } finally {
    mongoose.connection.close();
  }
};

verifyAdminPassword();