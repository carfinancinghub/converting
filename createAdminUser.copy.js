const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:admin123@127.0.0.1:27017/car-haul?authSource=admin';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const createAdminUser = async () => {
  try {
    const email = 'admin@example.com';
    const password = 'admin123';
    const role = 'admin';

    // Check if admin user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Admin user already exists:', existingUser);
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the admin user
    const adminUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await adminUser.save();
    console.log('Admin user created successfully:', adminUser);
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    mongoose.connection.close();
  }
};

createAdminUser();