import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
      password: {
        type: String,
        required: true
    },
      role: {
        type: String,
        enum: ["user", 'admin'],
        default: 'user'
    },
    refreshTokens: [
      {
        tokenHash : {
          type: String,
          required: true
        },

      createdAt: {
        type: Date,
        default: Date.now
      }
      }
    ],
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    emailOtpHash: {
      type: String
    },
    emailOtpExpires: {
      type: Date
    },
    emailOtpAttempts: {
      type: Number,
      default: 0
    },
    emailOtpLastSentAt: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema)