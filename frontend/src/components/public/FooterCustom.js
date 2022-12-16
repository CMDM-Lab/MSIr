import React from "react";

const footerCustom = ()=>{
    return (
        <footer className="footr_area p_t_100">
            <div className="footer_widget_area">
                <div className="container">
                    <h5>MSI Registrar is developed by CMDM Lab at National Taiwan University.</h5>
                    <br/>
                    <div className="row footer_widget_inner">
                        <div className="col-lg-2 col-sm-2">
                            <aside className="f_widget f_about_widget">
                                <a href="https://www.cmdm.tw/">
                                    <img height="125px" src="https://web.cmdm.tw/assets/images/cmdmlogo.png" alt="CMDM lab logo"/>
                                </a>
                            </aside>
                        </div>
                        <div className="col-lg-3 col-sm-3">
                            <aside className="f_widget f_about_widget">
                                <a href="https://www.ntu.edu.tw/">
                                    <img height="125px" src="https://www.ntu.edu.tw/images/logo.png"  alt='NTU logo'/>
                                </a>
                            </aside>
                        </div>
                        <div className="col-lg-4 col-sm-4">
                            <br/>
                            <h5>Contact<p>Please email us at: msiregistrar@cmdm.csie.ntu.edu.tw</p></h5>
                        </div>
                        <div className="col-lg-3 col-sm-3">
                            <br/>
                            <h6>
                                Copyright © {new Date().getFullYear()} All rights reserved<br></br>
                                This template is made&ensp;
                                by&ensp;
                                <a href="https://colorlib.com" target="_blank"  rel="noreferrer">Colorlib</a>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default footerCustom;
