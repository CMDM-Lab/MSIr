import React from "react";
import Banner from "./Banner";
const Home = (prop) =>{
  return(
    <>
    <Banner title={'MSI Registrar II'} subtitle={null}/>
    <section class="challange_area">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-6">
            <div class="challange_text_inner">
              <div class="l_title">
                <span class="fa-stack fa-2x">
                </span>
                <h6>Discover the features</h6>
                <h2>What is MSI Registrar II?</h2>
              </div>
              <p>MSI Registrar is a web service for automatic image registration between MSI images and H&E images. We deployed a generic contour-based approach to perform co-registration in a few seconds for various kinds of MSI techniques.</p>
            </div>
          </div>
          {/*<div class="col-lg-6 challange_img">

  </div>*/}
        </div>
      </div>
    </section>
    </>
  )

}
export default Home