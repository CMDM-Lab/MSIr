import React from "react"
import { Button } from "bootstrap"

const ProjectInform = ({data})=>{

    if (!data){
        return (
            <>
                <tr>
                    <td colSpan={3}>
                      <b>No projects.</b>
                      <i className="fad fa-arrow-right" />
                      <a href=''></a>
                    </td>
                </tr>
            </>
        )
    }

    return (
        <>
            <tr>
                <td style={{width: '40%'}}>
                    Name: {}
                    <table className="table" style={{fontSize: '1em'}}>
                        <tbody>
                            <tr>
                                <td colSpan={3}>Pixel size</td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{width: '70%'}}>X-axis:</td>
                                <td>{}</td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{width: '70%'}}>Y-axis:</td>
                                <td>{}</td>
                            </tr>
                        </tbody></table>
                </td>
                <td className="project_info">
                    <table className="table" style={{fontSize: '1em'}}>
                        <tbody><tr>
                            <td style={{width: '70%'}}>Normalization:</td>
                            <td>{}</td>
                          </tr>
                        </tbody></table>
                </td>
                <td>
                    <table className="table" style={{fontSize: '1em'}}>
                        <tbody>
                            <tr><td style={{width: '70%'}}>
                                <Button href=''>Display</Button>
                            </td></tr>
                            <tr><td style={{width: '70%'}}>
                                <Button href=''>Edit</Button>
                            </td></tr>
                            <tr><td style={{width: '70%'}}>
                                <Button onClick={}>Delete</Button>
                            </td></tr>
                        </tbody></table>
                </td>
            </tr>
        </>
    )
}
export default ProjectInform