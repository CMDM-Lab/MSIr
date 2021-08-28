import { User } from "../db/db";

const checkDuplicateEmail = (req, res, next) => {
    console.log(req.body)
    // Email
    User.findOne({
        where: {
          email: req.body.email
        }
      }).then(user => {
        if (user) {
          res.status(400).send({
            message: "Failed! Email is already in use!"
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