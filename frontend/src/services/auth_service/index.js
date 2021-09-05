//import { register } from './register'
import instance from '../api'
import { ContextProvider, useAuthState, useAuthDispatch, loginUser, logout, useInfoState, registerUser } from './context'

const resetRequire = async (payload) => {
    try {
        const res = await instance.post('/auth/reset_req',payload)
        return res
    } catch (error) {
        return error.response        
    }
}

const resetPassword = async (payload) =>{
    try {
        const res = await instance.post('/auth/reset',payload)
        return res
    } catch (error) {
        return error.response        
    }
}

export {ContextProvider, useAuthState, useAuthDispatch, loginUser, logout, registerUser, useInfoState, resetRequire, resetPassword }