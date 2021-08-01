import '../../stylesheet/signin.css'
import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { required, validEmail, validpassword } from '../../utils/validation'

import {useAuthDispatch, useAuthState, loginUser} from "../../services/auth_service";

const SignIn = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAuthDispatch()
  const { loading, errorMessage } = useAuthState()

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      try {
        let response = await loginUser(dispatch, { email, password })
        if (!response.user) return
        props.history.push('/home')
      } catch (error) {
          console.log(error)
        }
    } //else {
      //setLoading(false);
    //}
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className='wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54'>
            <Form onSubmit={handleLogin} ref={form} className='login100-form validate-form'>
              <div className="wrap-input100 validate-input m-b-23">
                <label htmlFor="email" className='label-input100 '>Email</label>
                <Input
                  type="text"
                  className="input100"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                  placeholder='Type your E-mail'
                  id="email"
                />
                <span className='focus-input100'/>
              </div>

              <div className="wrap-input100 validate-input">
                <label htmlFor="password" className='label-input100'>Password</label>
                <Input
                  type="password"
                  className="input100"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, validpassword]}
                  placeholder='Type your password'
                  id="password"
                />
                <span className='focus-input100'/>
              </div>

              <div className='text-right p-t-8 p-b-31'>
                <a href='/users/password/reset' className="text-decoration-none">Forgot your password?</a>
              </div>

              <div className='text-center'>
                guest account: guest@guest.com; password: guestguest
              </div>

              <div className="container-login100-form-btn">
                <div className='wrap-login100-form-btn'>
                  <div className='login100-form-bgbtn'></div>
                  <button className="login100-form-btn" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                </div>
              )}
              <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
            <div className='flex-col-c p-t-155'>
                <span className='txt1 p-b-17'>Or Sign Up Using</span>
              </div>
              <div className='container-login100-form-btn'>
                <div className='wrap-login100-form-btn'>
                  <div className='signup100-form-bgbtn'></div>
                  <a className='form-input text-decoration-none' href='/users/sign_up'>
                      <button className='login100-form-btn'>Sign up</button>
                  </a>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;