import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { required, validEmail, validpassword } from '../../utils/validation'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import {registerUser} from "../../services/auth_service";
import Banner from "../public/Banner";

const Register = (props) => {
  const MySwal = withReactContent(Swal)

  const form = useRef();
  const checkBtn = useRef();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  //const [successful, setSuccessful] = useState(false);
  //const [message, setMessage] = useState("");

  const onChangePasswordConfirmation = (e) => {
    const passwordConfirmation = e.target.value;
    setPasswordConfirmation(passwordConfirmation);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    //setMessage("");
    //setSuccessful(false);

    form.current.validateAll();

    if (password !== passwordConfirmation) {
      MySwal.fire({icon: 'error',
      title: 'Oops...',
      text: 'Password and password confirmation are different, please check!',
      })
      return
    }

    if (checkBtn.current.context._errors.length === 0) {
      try {
        const res = await registerUser({email, password})
        if (res.status >= 200 && res.status <300){
          //setSuccessful(true);
          MySwal.fire({
            icon: 'success',
            title: res.data.message,
            text: 'Please sign in!',
            confirmButtonText: '<a href="/users/sign_in">OK</a>'
          })
        }
        else{
          if (res.status >= 400 && res.status <500){
            MySwal.fire({
              icon: 'error',
              title: res.data.message,
              text: 'Please check again or try to reset password.',
              footer: '<a href="/users/password/reset">Reset your password?</a>'
            })
          }else{
            if (res.status >= 500){
              MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please retry after a while.',
              })
            }
          }
        }
        
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        })
      }
    }
  };

  return (
    <>
    <Banner title={'Sign Up'} />
    <div className="limiter">
      <div className="container-login100">
        <div className='wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54'>
          <Form onSubmit={handleRegister} ref={form} className='login100-form validate-form'>
            {(
              <>
                <div className="wrap-input100 validate-input m-b-23">
                  <label htmlFor="email" className='label-input100'>Email</label>
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

                <div className="wrap-input100 validate-input">
                  <label htmlFor="passwordConfirmation" className='label-input100'>Password confirmation</label>
                  <Input
                    type="password"
                    className="input100"
                    name="passwordConfirmation"
                    value={passwordConfirmation}
                    onChange={onChangePasswordConfirmation}
                    validations={[required, validpassword]}
                    placeholder='Type your password again'
                    id="passwordConfirmation"
                  />
                  <span className='focus-input100'/>
                </div>

                <div className='text-right p-t-8 p-b-31'>
                  <em>(6 characters minimum)</em>
                </div>

                <div className="container-login100-form-btn">
                <div className='wrap-login100-form-btn'>
                  <div className='login100-form-bgbtn'></div>
                  <button className="login100-form-btn">
                    Sign Up
                  </button>
                </div>
              </div>
              </>
          )}
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
            <div className='flex-col-c p-t-155'>
                <span className='txt1 p-b-17'>Or Log In Using</span>
            </div>
          </Form>
            <div className='container-login100-form-btn'>
                <div className='wrap-login100-form-btn'>
                  <div className='signup100-form-bgbtn'></div>
                    <a className='form-input text-decoration-none' href='/users/sign_in'>
                      <button className='login100-form-btn'>Sign In</button>
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;