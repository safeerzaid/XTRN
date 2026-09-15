import User from "../models/User.js"
import { signupSchema } from "../validators/authValidator.js";
import bcrypt from "bcryptjs";
import  {
  generateAccessToken,
  generateRefreshToken
} from '../utils/token.js'
import jwt from "jsonwebtoken"

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

    const userResponse = newUser.toObject()
    delete userResponse.password

    res.status(201).json({
      message: 'user created successfully',
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

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const user = await User.findOne({email})

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
  const refreshTokenHash =await bcrypt.hash(refreshToken, 10)

  user.refreshTokens.push({
    tokenHash: refreshTokenHash
  })

  await user.save()

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:  7 * 24 * 60 * 60 * 1000
  })

  return res.status(200).json({
    message:"login successfull",
    accessToken
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

    let isValidRefreshToken = false

for (const storedToken of user.refreshTokens) {
  const isMatch = await bcrypt.compare(
    refreshToken,
    storedToken.tokenHash
  )

  if (isMatch) {
    isValidRefreshToken = true
    break
  }
}

if (!isValidRefreshToken) {
  return res.status(401).json({
    message: "Invalid refresh token"
  })
}

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      })
    }

    const accessToken = generateAccessToken(user._id)

    return res.status(200).json({
      accessToken
    })

  } catch (error) {
    console.log(error)

    return res.status(401).json({
      message: "Invalid or expired refresh token"
    })
  }
}