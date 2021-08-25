import instance from "./api";
import authHeader from "./auth-header";

const submit = async (payload) => {
    try {
        const res = instance.post('/msi/submit', payload, {
            headers: authHeader()
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

const msi_service = {submit}

export default msi_service