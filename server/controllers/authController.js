import User from "../models/User.js"
import { signupSchema } from "../validators/authValidator.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'


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

  const token = jwt.sign(
    {id: user._id},
    process.env.JWT_SECRET,
    {expiresIn: "7d"}
  )

  return res.status(200).json({
    message: 'login successfull',
    token, 
  })
  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};


