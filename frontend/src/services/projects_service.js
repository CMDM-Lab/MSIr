import instance from "./api";
import authHeader from "./auth-header";

const create = async (payload) => {
    try {
        const res = await instance.post('/projects/new',payload, {
            headers: authHeader(),
        })
        return res
    } catch (error) {
        console.log(error)
    }
    
}

const remove = async (payload) => {
    try {
        const res = await instance.delete('/projects/delete', {
            headers: authHeader(),
            data: payload
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

const example = async (payload) => {
    try {
        const res = await instance.post('/projects/example',payload, {
            headers: authHeader(),
        })
        return res
    } catch (error) {
        console.log(error)
    }
    
}

const all = async (payload) => {
    try {
        const res = await instance.get('/projects/all', {
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
        const res = await instance.get('/projects/show', {
            headers: authHeader(),
            params: payload
        })
        return res
    } catch (error) {
        console.log(error)
    }
    
}

const edit = async (payload) => {
    try {
        const res = await instance.put('/projects/edit',payload,{
            headers: authHeader()})
        return res
    } catch (error) {
        console.log(error)
    }
}

const projectService = {
    edit, show, all, example, remove, create
}

export default projectService