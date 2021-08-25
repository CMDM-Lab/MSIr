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

const registration_service = {show, all, remove, create}

export default registration_service