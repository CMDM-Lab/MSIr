import instance from "./api";
import authHeader from "./auth-header";

const create = async (payload) => {
    try {
        const res = await instance.post('/extractions/new', payload,{
            headers: authHeader()
        })
        return res
    } catch (error) {
      console.log(error)  
    }
    
}

const remove = async (payload) => {
    try {
        const res = await instance.delete('/extractions/delete',{
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
        const res = instance.get('/extractions/all',{
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
        const res = instance.get('/extractions/show',{
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        console.log(error)
    }
    
}

const extractionService = {
    show, all, remove, create
}

export default extractionService