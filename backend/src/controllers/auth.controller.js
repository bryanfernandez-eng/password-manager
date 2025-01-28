import {User} from "../models/user.model.js"; 

export const signup = async (req, res) => {
  const {name, email, password} = req.body; 
  
    try {

        if(!name || !email || !password) {
            return res.status(400).json({msg: 'Please fill all fields'});
        }

        const existingUser = await User.findOne({email}); 

    
        if(existingUser) {
            return res.status(400).json({msg: 'Email already exists'});
        }

        const newUser = new User({name, email, password});

        await newUser.save();

        return res.status(200)

  } catch (error) {
    console.error("Error in signup controller: ", error.message);
    res.status(500).send('Server Error');
  }
};
