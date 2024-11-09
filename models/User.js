import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
  },

  avatar: {
    public_id: String,
    url: String,
  },

  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: [true, 'Email already exists'],
  },

  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Password will not be fetched by default
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values while ensuring unique non-null values
  },

  authMethod: {
    type: String,
    enum: ['local', 'google'],
    required: true,
    default: 'local',
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Pre-save middleware to hash password if it was modified or newly set
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.authMethod === 'local') {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to match user-entered password with hashed password in the database
userSchema.methods.matchPassword = async function (password) {
  if (this.authMethod === 'local') {
    return await bcrypt.compare(password, this.password);
  }
  return false;
};

// Method to generate JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });
};

// Generate a reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
