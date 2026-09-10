import User from "../models/User.js"



export const signup = async (req,res) => {
  try{
    const { name, email, password } = req.body;
    
    if(!name || !email || !password){
      return res.status(400).json({
        message: 'please fill all the fields'
      })
    }

    const existingUser = await User.findOne({
      email
    })

    if(existingUser){
      return res.status(400).json({
        message: 'Email already exist'
      })
    }

    const newUser = await User.create({
      name,
      email,
      password
    })

    res.status(201).json({
      message: 'user created successfully',
      user: newUser
    })

  }catch(error){
    console.log(error)
    res.status(500).json({
      message: "server Error"
    })
  }
} 

