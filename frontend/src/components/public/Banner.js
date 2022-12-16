import React from "react";

export default ({ title, subtitle, titleStyle, subtitleStyle }) => {
    return (
        <section className='banner_area'>
            <div className='container'>
                <div className='banner_inner_text text-center'>
                    {title ? (<h2 style={titleStyle}>{title}</h2>) : null}
                    {subtitle ? (<span className='login100-form-title p-b-49' style={subtitleStyle}><p>{subtitle}</p></span>) : null}
                </div>
            </div>
        </section>
    )
}
// need to modify and add