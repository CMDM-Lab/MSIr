import React, {useEffect, useState} from 'react'
import DatasetItem from './DatasetItem'
//import { useAuthState } from '../../services/auth_service'
import Banner from '../public/Banner'
import datasetService from '../../services/datasets_service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from 'react-router-dom'
import { handleResponse } from '../../utils/handleResponse'

const Datasets = (prop)=>{
  
  const MySwal = withReactContent(Swal)

  //const userDetails = useAuthState()
  const history = useHistory()
  const [datasets, setDatasets] = useState([])

  const getData = async()=>{
    try {
      const res_dataset = await datasetService.all()
      const {data} = res_dataset.data
      console.log(data)
      if (res_dataset.status >= 200 && res_dataset.status <300){
        setDatasets(data)
      } else{
        handleResponse(res_dataset, MySwal, history)
    }
    } catch (error) {
      console.log(error) 
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
          iconColor: '#000000',
          title: res.data.message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#000000'
        }).then(()=>{
          history.push(`/datasets/${res.data.datasetId}`); 
        })
    } else{
        handleResponse(res, MySwal, history)
    }
    } catch (error) {
      console.log(error)
      MySwal.fire({
        icon: 'error',
        iconColor: '#000000',
        title: `Error`,
        text: `Please retry after a while.`,
        confirmButtonColor: '#000000',
      })
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
                Datasets
              </li></ol></div></div>
        <div className="row">
          {/* <div className="col-lg-2">
            <div className="challange_text_inner">
              <div className="l_title">
                <h6>Quick menu</h6>
                <div className="btn-group-vertical">
                  <div className='btn btn-warning' onClick={onClickExample}>Import an example</div>
                  <a className='btn btn-primary' href='/datasets/new'>New Dataset</a>
                </div></div></div></div> */}
          <div className="col-lg-2 col-2" />
          <div className="col-lg-8">
            {}
            <table className="table object_list">
              <thead>
                <tr>
                  <th>Dataset Name</th>
                  <th>Dataset Description</th>
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
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                    )}
              </tbody>
            </table>
          </div>
          <div className="col-lg-8 col-8"/>
            <div className="col-lg-2">
            <a className='btn btn-outline-dark' href='/datasets/new'>??? New</a>
            &nbsp;&nbsp;
            <div className='btn btn-outline-secondary' onClick={onClickExample}>??? Example</div>
            </div>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </section>
    </>

    )
}

export default Datasets