import { User } from "../db/db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

//const Op = db.Sequelize.Op;

export const signup = (req, res) => {
  // Save User to Database
  const user = User.create({
    email: req.body.email,
    encrypted_password: bcrypt.hashSync(req.body.password, 8)
  }).catch(err => {
    return res.status(500).json({ message: err.message });
  });
  
  return res.json({ message: "User was registered successfully!" }); 
};

export const signin = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    }).catch(err => {
        res.status(500).json({ message: err.message });
    });

    if (!user) {
        return res.status(404).json({ message: "Invalid mail. Please sign up first." });
    }
    
    var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.encrypted_password
    );

    if (!passwordIsValid) {
        return res.status(401).json({
          auth_token: null,
          message: "Invalid Password!"
        });
    }

    var token = jwt.sign({ id: user.id, email:user.email }, process.env.SECRET, {
        expiresIn: 3600 // 24 hours
    });

    user.token = token
    user.save()
    
    res.status(200).json({
        user: {
            id: user.id,
            email: user.email
        },
        auth_token: token
    });
    
};