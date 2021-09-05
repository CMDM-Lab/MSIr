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
        return res.status(400).json({ message: "Invalid mail. Please sign up first." });
    }
    
    var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.encrypted_password
    );

    if (!passwordIsValid) {
        return res.status(400).json({
          auth_token: null,
          message: "Invalid Password!"
        });
    }

    var token = jwt.sign({ id: user.id, email:user.email }, process.env.SECRET, {
        expiresIn: 5400 // 1.5 hours
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

export const resetRequire = async (req, res) => {
    const user = await User.findOne({
        where:{
            email: req.body.email
        }
    }).catch(err => {
        res.status(500).json({ message: err.message });
    });
    if (!user){
        return res.status(400).json({ message: "Invalid mail. Please sign up first." });
    }

    reset_password_sent_at = Date.now()

    var reset_token = jwt.sign({ id: user.id, email:user.email, reset_password_sent_at, expire_at:reset_password_sent_at+14400 }, process.env.SECRET, {
        expiresIn: 14400 // 1.5 hours
    });

    user.reset_password_token = reset_token
    user.reset_password_sent_at = reset_password_sent_at
    user.save()

    // send email with reset_password url with reset_password_token

}

export const resetPassword = async (req, res) => {
    const user = await User.findOne({
        where: {
            reset_password_token: req.body.reset_password_token
        }
    }).catch(err => {
        res.status(500).json({ message: err.message });
    });

    if (!user){
        return res.status(400).json({ message: "Invalid reset token. Please try to require reset again." })
    }

    if (Date.now()-user.reset_password_sent_at > 14400){
        return res.status(400).json({ message: "Expired Reset token. Please try to require reset again." })
    }

    user.encrypted_password = bcrypt.hashSync(req.body.password, 8)
    user.reset_password_token = null
    user.reset_password_sent_at = 0
    user.save()

    return res.json({message: "Password has been reset! Please use new password to sign in."})
} 