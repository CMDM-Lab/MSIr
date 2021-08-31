import React, { useCallback, useEffect,useState } from "react"
import { useParams } from 'react-router'
import { useHistory } from "react-router-dom"
import Banner from "../public/Banner"
import datasetService from "../../services/datasets_service"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const DatasetEdit = () => {
    const MySwal = withReactContent(Swal)

    const [name,setName] = useState('')
    const [description, setDescription] = useState('')
    const {datasetId} = useParams()
    const history = useHistory()

    const getData = async()=>{
        const res = await datasetService.show({datasetId})
        if (res.status >= 200 && res.status <300){
            setName(res.data.dataset.name)
            setDescription(res.data.dataset.description)
        } else{
            switch(res.status){
                case 404:
                case 401:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res.data.message}`,
                    }).then(()=>{
                        history.goBack()
                    })
                    break
                case 403:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res.data.message}`,
                    }).then(()=>{
                        history.push('/users/sign_in')
                    })
                    break
                case 500:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res.data.message}`,
                        text: `Please retry after a while. (${res.data.message})`,
                      }).then(()=>{
                        history.goBack()
                    })
                    break
            }
        }
    }

    useEffect( async ()=>{
        getData()
    },[])

    const onChangeName = (e)=>{
        const value = e.target.value;
        setName(value)
    }

    const onChangeDescription = (e)=>{
        const value = e.target.value;
        setDescription(value)
    }

    const handleSubmit = async () => {
        if (name.length<1){
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please type a dataset name !',
            })
            return 
        }
        try {
            const res = await datasetService.edit({name, description, datasetId})
            if (res.status >= 200 && res.status <300){
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    confirmButtonText: 'OK'
                  }).then(()=>{
                    history.goBack(); 
                  })
            }else{
                switch(res.status){
                    case 404:
                    case 401:
                        MySwal.fire({
                            icon: 'error',
                            title: `${res.data.message}`,
                        }).then(()=>{
                            history.goBack()
                        })
                        break
                    case 403:
                        MySwal.fire({
                            icon: 'error',
                            title: `${res.data.message}`,
                        }).then(()=>{
                            history.push('/users/sign_in')
                        })
                        break
                    case 500:
                        MySwal.fire({
                            icon: 'error',
                            title: `${res.data.message}`,
                            text: `Please retry after a while. (${res.data.message})`,
                          }).then(()=>{
                            history.goBack()
                        })
                        break
                }
            }
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
              })
        }
    }

    return (
    <>
    <Banner title = {'Edit this Dataset'} />
    <section className="challange_area">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-2 col-3" />
                <div className="col-lg-10 col-9">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href='/'>Home</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href='/datasets'>Datasets</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href={`/datasets/${datasetId}`}>{datasetId}</a>
                        </li>
                        <li className="breadcrumb-item active">
                            <a>Edit this dataset</a>
                        </li>
                    </ol></div></div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Dataset name*</label>
                <div className="col-6">
                    <input 
                    type="text"
                    name='name'
                    value={name}
                    className='form-control input100'
                    placeholder='Type Dataset Name'
                    id="name"
                    onChange={onChangeName}
                    />
                </div></div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Dataset Description</label>
                <div className="col-6">
                    <input 
                    type='text'
                    name='description'
                    value={description}
                    className='form-control input100'
                    placeholder='Type Dataset Description'
                    id="description"
                    onChange={onChangeDescription}
                    />
                </div>
            </div>
            
            <div className="form-group row py-2">
                <div className="col-lg-5 col-3" />
                <button onClick={handleSubmit} className='btn btn-primary col-lg-1 col-1'>Save</button>
            </div>
        </div>
      </section>
      </>
    )
}

export default DatasetEdit