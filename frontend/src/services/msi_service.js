import instance from "./api";
import authHeader from "./auth-header";

const submit = async (payload) => {
    try {
        const res = await instance.post('/msi/submit', payload, {
            headers: authHeader()
        })
        return res
    } catch (error) {
        console.log(error)
        return error.response
    }
}

const getMSI = async (payload) => {
    try {
        const res = await instance.get('/msi/get',{
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        console.log(error)
        return error.response
    }
}

const msi_service = {submit, getMSI}

export default msi_service