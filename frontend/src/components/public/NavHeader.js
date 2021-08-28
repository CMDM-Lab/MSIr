import React from "react";
import logo from '../../stylesheet/logo.svg';
import {NavLink} from 'react-router-dom'
import { logout, useAuthState, useAuthDispatch } from '../../services/auth_service/context'

const NavHeader = ({currentState,setCurrentState})=>{
    
    const userDetails = useAuthState()
    const dispatch = useAuthDispatch()
    
    return (
        <header className="main_menu_area">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">
                    <img height={150} src={logo} width={211} />
                </a>
                <button aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler" data-target="#navbarSupportedContent" data-toggle="collapse" type="button">
                    <span />
                    <span />
                    <span />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        <li className={`nav-item ${currentState==='home'?'active':''}`}>
                            <p ><NavLink to='/home' onClick={()=>{setCurrentState('home');}}>Home</NavLink></p>
                        </li>
                        <li className={`nav-item ${currentState==='Create a new project'?'active':''}`}>
                            <p ><NavLink to='/projects/new'onClick={()=>setCurrentState('Create a new project')}>Start</NavLink></p>
                        </li>
                        {Boolean(userDetails.token)?(
                            <li className={`nav-item ${currentState==='Project'?'active':''}`}>
                                <p ><NavLink to='/projects' onClick={()=>setCurrentState('Project')}>Project</NavLink></p>
                            </li>):''
                        }
                        <li className={`nav-item ${currentState==='Document'?'active':''}`}>
                            <p ><NavLink to='/doc' onClick={()=>setCurrentState('Document')}>Docs</NavLink></p>
                        </li>
                        <li className={`nav-item ${currentState==='Contact us'?'active':''}`}>
                            <p ><NavLink to='/contact' onClick={()=>setCurrentState('Contact us')}>Contact</NavLink></p>
                        </li>
              {Boolean(userDetails.token)?(
                <li className="nav-item dropdown submenu">
                    <a aria-expanded="false" aria-haspopup="true" className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" id="navbarDropdown">
                        <i className="fad fa-user-circle fa-lg" />
                            User
                    </a>
                    <ul aria-labelledby="navbarDropdown" className="dropdown-menu">
                        <li className="nav-item">
                            <p ><NavLink to='/home' onClick={()=>{
                                logout(dispatch)
                                setCurrentState('home');}}>Logout</NavLink></p>
                        </li>
                    </ul>
                </li>):(
                <li className={`nav-item ${currentState==='Sign in'?'active':''}`}>
                    <p ><NavLink to='/users/sign_in' onClick={()=>setCurrentState('Sign in')}>Sign in</NavLink></p>
                </li>)
                }
            </ul>
          </div>
        </nav>
      </header>
    )
}
export default NavHeader;