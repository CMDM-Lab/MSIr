import React, {useEffect, useState} from 'react'
import DatasetItem from './DatasetItem'
import { useAuthState } from '../../services/auth_service'
import Banner from '../public/Banner'
import datasetService from '../../services/datasets_service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import path from 'path'
import { useHistory } from 'react-router-dom'

const Datasets = (prop)=>{
  
  const MySwal = withReactContent(Swal)

  const userDetails = useAuthState()
  const history = useHistory()
  const [datasets, setDatasets] = useState([])

  const getData = async()=>{
    const res_dataset = await datasetService.all()
    const {data} = res_dataset.data
    console.log(data)
    if (res_dataset.status >= 200 && res_dataset.status <300){
        setDatasets(data)
        //console.log({...data.dataset,msi:data.msi,histologyImage:data.histologyImage})
    } else{
        switch(res_dataset.status){
            case 404:
            case 401:
                MySwal.fire({
                    icon: 'error',
                    title: `${res_dataset.data.message}`,
                }).then(()=>{
                    history.goBack()
                })
                break
            case 403:
                MySwal.fire({
                    icon: 'error',
                    title: `${res_dataset.data.message}`,
                }).then(()=>{
                    history.push('/users/sign_in')
                })
                break
            case 500:
                MySwal.fire({
                    icon: 'error',
                    title: `${res_dataset.data.message}`,
                    text: `Please retry after a while. (${res_dataset.data.message})`,
                  }).then(()=>{
                    history.goBack()
                })
                break
        }
    }
    }

  useEffect(()=>{
    getData()
  },[])

  //const data = await

  const onClickExample = async () =>{
    try {
      const res = await datasetService.example()
      if (res.status >= 200 && res.status <300){
        MySwal.fire({
          icon: 'success',
          title: res.data.message,
          confirmButtonText: 'OK'
        }).then(()=>{
          history.push(`/datasets/${res.data.datasetId}`); 
        })
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
    } catch (error) {
      
    }
    

  }


  return (
    <>
    <Banner title = {'Dataset List'} />
    <section className="challange_area">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-2" />
          <div className="col-lg-6 col-10" style={{paddingLeft: 0}}>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href='/'>Home</a>
              </li>
              <li className="breadcrumb-item">
                <a>Datasets</a>
              </li></ol></div></div>
        <div className="row">
          <div className="col-lg-2">
            <div className="challange_text_inner">
              <div className="l_title">
                {/*<span className="fa-stack fa-2x">
                                    <i className="fad fa-square fa-stack-2x" data-fa-transform="rotate-60" style={{-faPrimaryColor: '#A268C6', -faSecondaryColor: '#A268C6'}} />
                                    <i className="fad fa-square fa-stack-2x fa-inverse" data-fa-transform="rotate-30 shrink-1 left-1" style={{-faPrimaryColor: '#72BBDE', -faSecondaryColor: '#72BBDE'}} />
                </span>*/}
                <h6>Quick menu</h6>
                <div className="btn-group-vertical">
                  <a className='btn btn-warning' onClick={onClickExample}>Import an example</a>
                  <a className='btn btn-primary' href='/datasets/new'>New Dataset</a>
                </div></div></div></div>
          <div className="col-lg-10">
            {}
            <table className="table object_list">
              <thead>
                <tr>
                  <th>Dataset name / Dataset info</th>
                  {/*<th>MSI data Information</th>*/}
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {datasets.length>0? (
                  datasets.map((dataset)=>{return <DatasetItem data={dataset}/>})
                ):(
                  <tr>
                    <td>
                      <p>No Dataset</p>
                      <a href={'/datasets/new'}><button className='btn btn-primary'>Create a new Dataset</button></a>
                    </td>
                  </tr>
                    )}
              </tbody>
              </table></div></div></div></section>
              </>

    )
}

export default Datasets