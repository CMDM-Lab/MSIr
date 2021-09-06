import instance from "./api";
import authHeader from "./auth-header";

const create = async (payload) => {
    try {
        const res = await instance.post('/roi/new_batch', payload, {
            headers: authHeader()
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

const remove = async (payload) => {
    try {
        const res = await instance.delete('/roi/delete', {
            headers: authHeader(), 
            data: payload
        })
        return res
    } catch (error) {
        console.log(error)
    }
} 

const  show = async (payload) => {
    try {
        const res = await instance.get('/roi/show', {
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

const all  = async (payload) => {
    try {
        const res = await instance.get('/roi/all', {
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

const  allmask = async (payload) => {
    try {
        const res = await instance.get('/roi/allmask', {
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

const  allroi = async (payload) => {
    try {
        const res = await instance.get('/roi/allroi', {
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

const roi_service = {
    allroi, allmask, all, show, create, remove
}

export default roi_service