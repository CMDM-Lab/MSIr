import React, { useState, useRef } from "react";
import Banner from "../public/Banner";
import CheckButton from "react-validation/build/button";
import { required, validEmail } from '../../utils/validation'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from "react-router";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { resetRequire } from '../../services/auth_service'

const ResetRequire = () => {

  const MySwal = withReactContent(Swal)

  const form = useRef();
  const checkBtn = useRef();
  const [email, setEmail] = useState('')
  const history = useHistory()

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      try {
        const res = await resetRequire({ email })
        if (res.status >= 200 && res.status < 300) {
          MySwal.fire({
            icon: 'success',
            title: res.data.message,
            text: 'Please check your email!',
            confirmButtonText: 'OK'
          }).then(() => {
            history.push("/");
          })
        }
        else {
          if (res.status === 400) {
            MySwal.fire({
              icon: 'error',
              title: res.data.message,
              text: 'Please check again.',
            })
          } else {
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
      <Banner title={'Forgot your password?'} subtitle={'Send Password Reset Requirement'} />
      <div className="limiter">
        <div className="container-login100">
          <div className='wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54'>
            <Form onSubmit={handleSubmit} ref={form} className='login100-form validate-form'>
              {<>
                <div className="wrap-input100 validate-input m-b-23">
                  <label htmlFor="email" className='label-input100'>Email</label>
                  <Input
                    type="text"
                    className="input100"
                    name="email"
                    value={email}
                    onChange={onChangeEmail}
                    validations={[required, validEmail]}
                    placeholder='Type your E-mail used in Sign up'
                    id="email"
                  />
                  <span className='focus-input100' />
                  <div className='text-right p-t-8 p-b-31'>
                    <p>Please type your email used in Sign up</p>
                  </div>
                </div>
                <div className="container-login100-form-btn">
                  <div className='wrap-login100-form-btn'>
                    <div className='login100-form-bgbtn'></div>
                    <button className="login100-form-btn">
                      Send Reset Requirement
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

export default ResetRequire