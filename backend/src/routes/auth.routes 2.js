import express from 'express'
import { verifySignUp } from "../middleware"
import {resetPassword, resetRequire, signin, signup} from "../controllers/auth.controller"

let router = express.Router();

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post(
  "/signup",
  [
    verifySignUp.checkDuplicateEmail,
  ],
  signup
);

router.post("/signin", signin);

router.post('/reset_req', resetRequire)

router.post('/reset', resetPassword)

export default router