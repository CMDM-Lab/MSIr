import instance from "./api";
import authHeader from "./auth-header";

const create = async (payload) => {
    try {
        const res = await instance.post('/registrations/new', payload,{
            headers: authHeader(),
        })
        return res
    } catch (error) {
        console.log(error)
        return error.response
    }
    
}

const remove = async (payload) => {
    try {
        const res = await instance.delete('/registrations/delete',{
            headers: authHeader(),
            data: payload
        })

        return res
    } catch (error) {
        console.log(error)
        return error.response
    }
    
}

const all = async (payload) => {
    try {
        const res = await instance.get('/registrations/all',{
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        console.log(error)
        return error.response
    }
    
}

const show = async (payload) => {
    try {
        const res = await instance.get('/registrations/show',{
            headers: authHeader(),
            params: payload
        })

        return res
    } catch (error) {
        console.log(error)
    }
    
}

const registrationService = {show, all, remove, create}

export default registrationService