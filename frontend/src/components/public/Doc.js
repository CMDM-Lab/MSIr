import React from "react";
import Banner from "./Banner";
import registrationResult from "../../stylesheet/registration_result.png"
import registrationPage from "../../stylesheet/registration_result_page.png"
import extractionPage from "../../stylesheet/extraction_result_page.png"
const Doc = (prop)=>{
  return (
      <>
        <Banner title={'Document'} subtitle={null}/>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-lg-1 col-md-1'></div>
            <div className='col-lg-10 col-md-10'>
              <div className='l_title'>
                <div className='doc'>
                  <h3> What is MSI Registrar? </h3>
                  <p>MSI Registrar is a web-based service for automatic registration between MSI and Histology.<br/> 
                      MSI Registrar helps users to reduce manipulation complexity required in the image-registration procedure. <br/>
                      Based on automatic registration, MSI spectrum Indices are extracted from region of interest in Histology.
                  </p>
                  <br/>
                  <h3>Workflows </h3><br/>
                  <div className='row'>
                    <div className='col-12'>
                      <div className='card' style={{'width':'100%'}}>
                        {/*<img src="#{asset_pack_path('media/images/msiregistrar_workflow.svg')}" class="card-img-top" >*/}
                        <div className='card-body'>
                          <h5>Registration workflow</h5><br/>
                          <ol>
                              <li>Create an account or sign-in via Guest Account</li>
                              <li>Create a dataset</li>
                              <li>Upload a histology image</li>
                              <li>Upload MSI data</li>
                              <li>Create a registration</li>
                              <li>Download results</li>
                          </ol>
                        </div>
                        <div className='card-body'>
                        <h5>Extraction workflow</h5><br/>
                          <ol>
                              <li>Create a ROI in the histology</li>
                              <li>Create an extraction</li>
                              <li>Download results</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div><br/>
                  <h3>Steps</h3><br/>
                  <div className='row'>
                    <div className='col-12'>
                      <div className='card' style={{'width':'100%'}}>
                        <div className='card-body'>  
                          <h5>Registration steps</h5><br/>
                          <dl>
                            <dt>Sign up / sign in</dt>
                            <dd>- Sign up for a private account or sign in with the guest account (guest@guest.com; password: guestguest).</dd>
                            <dt>Create a dataset</dt>
                            <dd>- Uploaded data ,registrations, and extractions are stored in dataset.</dd>
                            <dt>Upload a histology image</dt>
                            <dd>- Upload the histological image (available format: *.png, *.jpg, *.jepg ; size limitation: xx MB)</dd>
                            <dd>- Set Spatial Resolution (optional). <br/>
                            <p style = {{color:'red'}}>  If the Spatial Resolutions of MSI data and histology are both set, the scale factor is calculated based on Spatial Resolution.</p></dd>
                            <dt>Upload MSI data</dt>
                            <dd>- Upload centroided imzML format data (available format: *.imzML & *.ibd; size limitation: xx MB) </dd>
                            <dd>- Set Datacube Bin Size </dd>
                            <dd>- Set Spatial Resolution (optional) <br/>
                            <p style = {{color:'red'}}>  If the Spatial Resolutions of MSI data and histology are both set, the scale factor is calculated based on Spatial Resolution.</p>
                            </dd>
                            <dt>Create a registration</dt>
                            <dd>- Create a registration with following setting:
                              <ol>
                                  <li>Registration type: 
                                    <ol>
                                      <li>Intenisty-based</li>
                                      <li>Contour-based</li>
                                    </ol></li>
                                  <li>Select used dimensionality reduction method in the intensity-based method
                                    <ol>
                                      <li>UMAP</li>
                                      <li>PCA</li>
                                    </ol>
                                  </li>
                                  <li>Select embedding dimensions (only for UMAP)</li>
                                  <li>Select used histology mask (optional)</li>
                              </ol>
                            </dd>
                            <dt>Download results</dt>
                            <dd>- After the registration process is finished, the result is shown like following:
                              <img src={registrationPage} className="card-img-top" alt="Registration page"></img>
                            </dd>
                            <dd>- The registration transformation matrices are stored in a text format file, and the detail as following: 
                              <img src={registrationResult} className="card-img-top" alt="Registration result"></img>
                            </dd>
                          </dl>
                        </div>
                        <div className='card-body'>  
                          <h5>Extractions steps</h5><br/>
                          <dl>
                            <dt>Create a ROI in the histology</dt>
                            <dd>- Draw ROIs in histology in the ROI selection page.</dd>
                            <dt>Create an extraction</dt>
                            <dd>- Create an extraction with following setting:
                              <ol>
                                  <li>Select a ROI</li>
                                  <li>Select a registration result</li>
                              </ol>
                            </dd>
                            <dt>Download results</dt>
                            <dd>- After the extraction process is finished, the result is shown like following:
                              <img src={extractionPage} className="card-img-top" alt="Extraction page"></img>
                            </dd>
                            <dd>- The spectral indices of MSI data in the ROI are stored in a text format file </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )  
}
export default Doc