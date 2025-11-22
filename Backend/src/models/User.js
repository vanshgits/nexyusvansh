const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'organizer'],
      default: 'user'
    },

    // OAuth Provider Info
    provider: {
      type: String,
      enum: ['local', 'google', 'github', 'facebook'],
      default: 'local'
    },
    providerId: {
      type: String // id from Google/GitHub/Facebook
    }
  },
  { timestamps: true }
);

const User = mongoose.model('users', UserSchema);

module.exports = User;
