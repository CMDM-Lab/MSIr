import React, { useState, useRef } from "react";
import Banner from "../public/Banner";
import CheckButton from "react-validation/build/button";
import { required, validpassword} from '../../utils/validation'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory, useParams } from "react-router";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import {resetPassword} from '../../services/auth_service'


const EditUserPassword = ()=>{

    const MySwal = withReactContent(Swal)

    const form = useRef();
    const checkBtn = useRef();
    const {reset_password_token} = useParams()
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const history = useHistory()

    const onChangePasswordConfirmation = (e) => {
        const passwordConfirmation = e.target.value;
        setPasswordConfirmation(passwordConfirmation);
      };
    
    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
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
            console.log(password)
            console.log(reset_password_token)
            const res = await resetPassword({password, reset_password_token})
            if (res.status >= 200 && res.status <300){
              MySwal.fire({
                icon: 'success',
                title: 'Success',
                text: res.data.message,
                confirmButtonText: 'OK'
              }).then(()=>{
                history.push("/users/sign_in"); 
              })
            }
            else{
              if (res.status === 400){
                MySwal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: res.data.message,
                  footer: '<a href="/users/password/reset">Reset your password?</a>'
                })
              }else{
                  MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please retry after a while.',
                  })
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
            <Banner title={'Reset your password'}/>
            <div className="limiter">
                <div className="container-login100">
                    <div className='wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54'>
                        <Form onSubmit={handleSubmit} ref={form} className='login100-form validate-form'>
                        {<>
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
                                        Reset Password
                                    </button>
                                </div>
                            </div>
                        </>
                        }
                            <CheckButton style={{ display: "none" }} ref={checkBtn} />
                        </Form>
                    </div>
                </div>
            </div>
         </>
    ) 
}

export default EditUserPassword