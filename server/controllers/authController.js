import User from "../models/User.js"
import { signupSchema, loginSchema } from "../validators/authValidator.js";
import bcrypt from "bcryptjs";
import  {
  generateAccessToken,
  generateRefreshToken,
  hashToken
} from '../utils/token.js'
import jwt from "jsonwebtoken"

const addRefreshToken = (user, tokenHash) => {
  user.refreshTokens.push({ tokenHash });
  while (user.refreshTokens.length > 5) {
    user.refreshTokens.shift();
  }
};

export const signup = async (req,res) => {
  try{
    const result = signupSchema.safeParse(req.body)
    
    if(!result.success){
      return res.status(400).json({
        message: 'invalid signup data'
      })
    }

    const { name, email, password } = result.data;

    const existingUser = await User.findOne({
      email
    })

    if(existingUser){
      return res.status(400).json({
        message: 'Email already exist'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      name,
      email,
      password : hashedPassword,
    })

        const accessToken = generateAccessToken(newUser._id)
    const refreshToken = generateRefreshToken(newUser._id)
    const refreshTokenHash = hashToken(refreshToken)

    addRefreshToken(newUser, refreshTokenHash)

    await newUser.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    const userResponse = newUser.toObject()
    delete userResponse.password
    delete userResponse.refreshTokens

    res.status(201).json({
      message: 'user created successfully',
      accessToken,
      user: userResponse
    })

  }catch(error){
    console.log(error)
    res.status(500).json({
      message: "server Error"
    })
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

    const user = await User.findOne({ email })

    if(!user){
      return res.status(404).json({
        message: "user not found",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
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
    maxAge:  7 * 24 * 60 * 60 * 1000
  })

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
};