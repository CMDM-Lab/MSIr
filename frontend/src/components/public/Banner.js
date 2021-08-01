import React from "react";

export default ({currentState})=>{
    return (
        <section className='banner_area'>
            <div className='container'>
                <div className='banner_inner_text text-center'>
                    <h2 style={{color: "#A6D6FF"}}>MSI Registrar 2</h2>
                    {currentState==='home'?(
                    <p>A Web Server for Automatic Generic Contour-based Co-registration of Mass Spectrometry Imaging and Histology</p>):
                    (<span className='login100-form-title p-b-49'><p>{currentState}</p></span>)
                    }
                </div>
            </div>
        </section>
    )
}
// need to modify and add