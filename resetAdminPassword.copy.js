const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
console.log("🔧 Using MONGO_URI:", MONGO_URI);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const resetAdmin = async () => {
  try {
    const email = 'admin@example.com';
    const plainPassword = 'admin123';
    const role = 'admin';

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = await User.findOneAndUpdate(
      { email },
      { email, password: hashedPassword, role },
      { upsert: true, new: true }
    );

    console.log(`✅ Admin user updated/created: ${admin.email}`);
    console.log(`🧪 Hashed password: ${admin.password}`);
  } catch (err) {
    console.error('Error resetting admin user:', err);
  } finally {
    mongoose.connection.close();
  }
};

resetAdmin();
