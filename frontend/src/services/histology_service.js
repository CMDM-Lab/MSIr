import instance from "./api";
import authHeader from "./auth-header";

const  show = async (payload) => {
    try {
        const res = await instance.get('/histology/show', {
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

const histology_service = {show}

export default histology_service