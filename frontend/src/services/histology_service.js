import instance from "./api";
import authHeader from "./auth-header";

const  getInformation = async (payload) => {
    try {
        const res = await instance.get('/histology/information', {
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        console.log(error)
        return error.response
    }
}

const submit = async (payload) => {
    try {
        const res = await instance.post('/histology/submit', payload, {
            headers: authHeader()
        })
        return res
    } catch (error) {
        console.log(error)
        return error.response
    }
}

const histology_service = {getInformation, submit}

export default histology_service