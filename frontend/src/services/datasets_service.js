import instance from "./api";
import authHeader from "./auth-header";

const create = async (payload) => {
    try {
        const res = await instance.post('/datasets/new',payload, {
            headers: authHeader(),
        })
        return res
    } catch (error) {
        return error.response
    }
    
}

const remove = async (payload) => {
    try {
        const res = await instance.delete('/datasets/delete', {
            headers: authHeader(),
            data: payload
        })
        return res
    } catch (error) {
        return error.response
    }
}

const example = async (payload) => {
    try {
        const res = await instance.post('/datasets/example',payload, {
            headers: authHeader(),
        })
        return res
    } catch (error) {
        return error.response
    }
    
}

const all = async (payload) => {
    try {
        const res = await instance.get('/datasets/all', {
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        return error.response
    }
    
}

const show = async (payload) => {
    try {
        const res = await instance.get('/datasets/show', {
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        return error.response
    }
    
}

const edit = async (payload) => {
    try {
        const res = await instance.put('/datasets/edit',payload,{
            headers: authHeader()})
        return res
    } catch (error) {
        return error.response
    }
}

const datasetService = {
    edit, show, all, example, remove, create
}

export default datasetService