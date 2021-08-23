import express from 'express'
import { verifySignUp } from "../middleware"
import {signin, signup} from "../controllers/auth.controller"
/*
export default (app) => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateEmail,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
};*/

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

export default router