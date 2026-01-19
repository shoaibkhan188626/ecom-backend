import mongoose, { model } from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      index: true,
      sparse: true,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    passwordChangedAt: {
      type: Date,
    },

    role: {
      type: String,
      enum: ['user', 'admin', 'support'],
      default: 'user',
      index: true,
    },

    permissions: {
      type: [String],
      default: [],
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    blockedReason: {
      type: String,
      trim: true,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
    },

    lastLoginAt: {
      type: Date,
    },

    refreshTokenHash: {
      type: String,
      select: false,
    },

    lastLoginIp: {
      type: String,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });

userSchema.index({ role: 1, isActive: 1 });

userSchema.virtual('password').set(function (password) {
  this._password = password;
});

userSchema.pre('save', async function () {
  if (!this._password) return;

  if (this._password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  const saltRounds = 12;
  this.passwordHash = await bcrypt.hash(this._password, saltRounds);
  this.passwordChangedAt = new Date();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.isAccountLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.markLoginSuccess = function (ip) {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  this.lastLoginAt = new Date();
  this.lastLoginIp = ip;
};

userSchema.methods.markLoginFailure = function () {
  this.loginAttempts += 1;

  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 15 * 60 * 1000;
  }
};

userSchema.pre(/^find/, function () {
  this.where({ deletedAt: null });
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
