import User from "../models/User.js"
import { signupSchema, loginSchema } from "../validators/authValidator.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken
} from '../utils/token.js'
import jwt from "jsonwebtoken"
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const addRefreshToken = (user, tokenHash) => {
  user.refreshTokens.push({ tokenHash });
  while (user.refreshTokens.length > 5) {
    user.refreshTokens.shift();
  }
};

export const signup = async (req, res) => {
  try {
    const result = signupSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        message: 'invalid signup data'
      })
    }

    const { name, email, password } = result.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already exist'
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashToken(rawToken);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken: hashedToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })

    const clientUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyLink = `${clientUrl}/verify-email/${rawToken}`;

    try {
      await sendEmail({
        to: newUser.email,
        subject: 'Verify your email - XTRN Store',
        html: `
          <p>Hi ${newUser.name},</p>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verifyLink}">${verifyLink}</a>
          <p>This link expires in 24 hours.</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // We continue since the user can request a resend later
    }

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);
    const refreshTokenHash = hashToken(refreshToken);

    addRefreshToken(newUser, refreshTokenHash);
    await newUser.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = newUser.toObject()
    delete userResponse.password
    delete userResponse.refreshTokens
    delete userResponse.verificationToken

    res.status(201).json({
      message: 'User created successfully.',
      accessToken,
      user: userResponse
    })

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already exist'
      });
    }
    console.error('Signup error:', error);
    res.status(500).json({
      message: "Server Error"
    });
  }
}


// login--------------------------------

export const login = async (req, res) => {
  try {

    const result = loginSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid login data",
      });
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email });

    let isMatch = false;
    if (!user) {
      // Compute dummy hash to prevent timing attacks
      await bcrypt.compare(password, '$2b$10$VWoys1Th9Igu9.sosE.qROU/0p9PDnOXBs63Une/p8ouAY4U9I4lu');
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!user || !isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    const refreshTokenHash = hashToken(refreshToken)

    addRefreshToken(user, refreshTokenHash)

    await user.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // Send login notification email asynchronously (fire-and-forget)
    try {
      const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' });
      sendEmail({
        to: user.email,
        subject: 'New login to your XTRN account',
        html: `
        <p>Hi ${user.name || 'User'},</p>
        <p>We noticed a new login to your XTRN Store account.</p>
        <p><strong>Time of login:</strong> ${timestamp}</p>
        <p>If this was you, you can safely ignore this email.</p>
      `
      }).catch(emailError => {
        console.error('Failed to send login notification email:', emailError);
      });
    } catch (error) {
      console.error('Error preparing login notification email:', error);
    }

    return res.status(200).json({
      message: "login successfull",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })



  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// -----------------
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found"
      })
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    )

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      })
    }

    const incomingHash = hashToken(refreshToken)
    const tokenExists = user.refreshTokens.some(t => t.tokenHash === incomingHash)

    if (!tokenExists) {
      user.refreshTokens = []
      await user.save()
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
      return res.status(401).json({
        message: "Session expired. Please log in again."
      })
    }

    user.refreshTokens = user.refreshTokens.filter(t => t.tokenHash !== incomingHash)

    const newRefreshToken = generateRefreshToken(user._id)
    const newRefreshTokenHash = hashToken(newRefreshToken)
    addRefreshToken(user, newRefreshTokenHash)
    await user.save()

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    const accessToken = generateAccessToken(user._id)

    return res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })

  } catch (error) {
    console.log(error)

    return res.status(401).json({
      message: "Invalid or expired refresh token"
    })
  }
}

//-----logout
// logout--------------------------------

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      const user = await User.findById(decoded.id);

      if (user) {
        const hash = hashToken(refreshToken);
        user.refreshTokens = user.refreshTokens.filter(t => t.tokenHash !== hash);
        await user.save();
      }
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.status(200).json({
      message: "logout successfull"
    });

  } catch (error) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.status(200).json({
      message: "logout successfull"
    });
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const rawEmail = req.body.email;
    let email = rawEmail?.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashToken(rawToken);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const clientUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    const resetLink = `${clientUrl}/reset-password/${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request - XTRN Store',
        html: `
          <p>You requested a password reset.</p>
          <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you did not request this, please ignore this email.</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send forgot password email:', emailError);
    }

    res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error processing forgot password request' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshTokens = []; // INVALIDATE ALL EXISTING SESSIONS
    await user.save();

    try {
      const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' });
      await sendEmail({
        to: user.email,
        subject: 'Your password has been changed',
        html: `
          <p>Hi ${user.name || 'User'},</p>
          <p>This is a confirmation that your password was successfully changed.</p>
          <p><strong>Time of change:</strong> ${timestamp}</p>
          <p>If you did not make this change, please contact support immediately.</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send password confirmation email:', emailError);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
};

export const resendVerification = async (req, res) => {
  try {
    let { email } = req.body;
    email = email?.toLowerCase().trim();
    const user = await User.findOne({ email });

    // Return generic success to avoid email enumeration
    if (!user) {
      return res.status(200).json({ message: 'If the email exists, a verification link has been sent' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashToken(rawToken);

    user.verificationToken = hashedToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const clientUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyLink = `${clientUrl}/verify-email/${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email - XTRN Store',
        html: `
          <p>Hi ${user.name},</p>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verifyLink}">${verifyLink}</a>
          <p>This link expires in 24 hours.</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send resend verification email:', emailError);
    }

    res.status(200).json({ message: 'If the email exists, a verification link has been sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Error resending verification email' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8 || newPassword.length > 100) {
      return res.status(400).json({ message: 'New password must be between 8 and 100 characters' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Invalidate all OTHER sessions
    const currentRefreshToken = req.cookies.refreshToken;
    if (currentRefreshToken) {
      const currentHash = hashToken(currentRefreshToken);
      user.refreshTokens = user.refreshTokens.filter(t => t.tokenHash === currentHash);
    } else {
      user.refreshTokens = [];
    }

    await user.save();

    try {
      const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' });
      await sendEmail({
        to: user.email,
        subject: 'Your password has been changed',
        html: `
          <p>Hi ${user.name || 'User'},</p>
          <p>This is a confirmation that your password was successfully changed.</p>
          <p><strong>Time of change:</strong> ${timestamp}</p>
          <p>If you did not make this change, please contact support immediately.</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send password confirmation email:', emailError);
    }

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};