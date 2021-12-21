import { User } from "../db/db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import {sendPasswordChangeMail, sendResetMail} from '../utils/mail'

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
    if (req.body.email=='guest@guest.com'){
        return res.status(400).json({ message: "Error! The password of guest account cannot be changed." });
    }

    const user = await User.findOne({
        where:{
            email: req.body.email
        }
    }).catch(err => {
        return res.status(500).json({ message: err.message });
    });
    if (!user){
        return res.status(400).json({ message: "Invalid mail. Please sign up first." });
    }

    const reset_password_sent_at = Date.now()

    var reset_token = jwt.sign({ id: user.id, email:user.email, reset_password_sent_at, expire_at:reset_password_sent_at+14400 }, process.env.SECRET, {
        expiresIn: 14400 // 1.5 hours
    });

    user.reset_password_token = reset_token
    user.reset_password_sent_at = reset_password_sent_at
    user.save()

    const res_mail = sendResetMail(user.email, reset_token)
    console.log(res_mail)
    if (res_mail){
        console.log('error')
        return res.status(500).json({message: error.message})
    }
    
    return res.json({message: 'Password reset email would be sent! Please check!'})

}

export const resetPassword = async (req, res) => {
    const user = await User.findOne({
        where: {
            reset_password_token: req.body.reset_password_token
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message });
    });

    if (!user){
        return res.status(400).json({ message: "Invalid reset token. Please try to require reset again." })
    }
    console.log(user.reset_password_sent_at)
    console.log(Date.now())
    console.log(Date.now()-user.reset_password_sent_at)
    if (Date.now()-user.reset_password_sent_at > 14400000){
        return res.status(400).json({ message: "Expired Reset token. Please try to require reset again." })
    }

    user.encrypted_password = bcrypt.hashSync(req.body.password, 8)
    user.reset_password_token = null
    user.reset_password_sent_at = new Date(0)
    user.save()

    
    try {
        sendPasswordChangeMail(user.email)
    }catch (error){
        return res.status(500).json({message: error.message})
    }

    return res.json({message: "Password has been reset! Please use new password to sign in."})
} 