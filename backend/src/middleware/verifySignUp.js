import { User } from "../db/db";

const checkDuplicateEmail = (req, res, next) => {
    // Email
    User.findOne({
        where: {
          email: req.body.email
        }
      }).then(user => {
        if (user) {
          res.status(400).json({
            message: "Failed! This email has been used to sign up!"
          });
          return;
        }
  
        next();
      });
};
  
const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
  };
  
export default verifySignUp;