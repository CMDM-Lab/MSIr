import React from "react";
import Banner from "./Banner";
const Home = (prop) =>{
  return(
    <>
    <Banner title={'MSI Registrar'} subtitle={null}/>
    <section class="challange_area">
      <div class="container-fluid">
        <div class="row">
          <div className='col-lg-3 col-md-3'></div>
          <div class="col-lg-8">
            <div>
              <div class="l_title">
                <span class="fa-stack fa-2x">
                </span>
                <br/>
                <h6>
                  Image Registration between MSI and Histology
                </h6>
                <h2>
                  What is MSI Registrar?
                </h2><br/>
                <p>
                  MSI Registrar is a web service for automatic image registration between MSI and Histology.<br/> 
                  MSI Registrar helps users to reduce manipulation complexity required in the image-registration procedure.<br/>
                  Based on automatic registration, MSI spectrum Indices are extracted from regions of interest in Histology.
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button onClick={()=>{
                        window.location.href = `/datasets/`;
                        }} className='btn btn-dark col-lg-1 col-1'>Start</button>
                  <br/>
                </p>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
              </div>
            </div>
          </div>
          {/*<div class="col-lg-6 challange_img"></div>*/}
        </div>
      </div>
    </section>
    </>
  )
}
export default Home