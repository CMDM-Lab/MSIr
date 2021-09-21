import React from "react";

const footerCustom = ()=>{
    return (
        <footer className="footr_area p_t_100">
            <div className="footer_widget_area">
                <div className="container">
                    <h5>MSI Registrar 2 is developed by CMDM Lab at National Taiwan University.</h5>
                    <div className="row footer_widget_inner">
                        <div className="col-lg-6 col-sm-6">
                            <aside className="f_widget f_about_widget">
                                <a href="https://www.cmdm.tw/">
                                    {/*<img height="150px" src="https://web.cmdm.tw/assets/images/cmdmlogo.png" />*/}
                                    CMDM LAB
                                </a>
                            </aside>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                            <aside className="f_widget f_about_widget">
                                <a href="https://www.ntu.edu.tw/">
                                    <img height="150px" src="https://www.ntu.edu.tw/images/logo.png" />
                                </a>
                            </aside>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="float-sm-left">
                        <h6>
                            Copyright © {new Date().getFullYear()} All rights reserved<br></br>
                            This template is made&ensp;
                            <i aria-hidden="true" className="fad fa-heart" />
                            by&ensp;
                            <a href="https://colorlib.com" target="_blank"  rel="noreferrer">Colorlib</a>
                        </h6>
                    </div>
                    <div className="float-sm-right" />
                </div>
            </div>
        </footer>
    )
}
export default footerCustom;
