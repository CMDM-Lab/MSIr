import React from "react";
const Contact = ()=>{
  return(
    <section className="challange_area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="challange_text_inner">
                <div className="l_title">
                    <span className="fa-stack fa-2x">
                        <i className="fad fa-square fa-stack-2x" data-fa-transform="rotate-60" style={{faPrimaryColor: '#A268C6', faSecondaryColor: '#A268C6'}} />
                        <i className="fad fa-square fa-stack-2x fa-inverse" data-fa-transform="rotate-30 shrink-1 left-1" style={{faPrimaryColor: '#72BBDE', faSecondaryColor: '#72BBDE'}} />
                    </span>
                    <h3>Contact us via E-mail</h3>
                </div>
                <p>Please email us at: msiregistrar2@cmdm.csie.ntu.edu.tw</p>
              </div>
            </div>
            <div className="col-lg-6 challange_img" />
          </div>
        </div>
      </section>
  )
    
}
export default Contact