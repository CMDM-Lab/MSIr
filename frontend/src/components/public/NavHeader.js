import React from "react";
//import logo from '../../stylesheet/logo.svg';
import {NavLink} from 'react-router-dom'
import { logout, useAuthState, useAuthDispatch } from '../../services/auth_service/context'

const NavHeader = ({currentState,setCurrentState})=>{
    
    const userDetails = useAuthState()
    const dispatch = useAuthDispatch()
    
    return (
        <header className="main_menu_area">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a className="navbar-brand" href="/">
                    {/*<img height={150} src={logo} width={211} />*/}
                    <h2>MSI Registrar</h2>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span/>
                    <span/>
                    <span/>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className='nav-item'/>
                        <li className={`nav-item ${currentState==='home'?'active':''}`}>
                            <p ><NavLink to='/home' onClick={()=>{setCurrentState('home');}}>Home</NavLink></p>
                        </li>
                        <li className={`nav-item ${currentState==='Create a new dataset'?'active':''}`}>
                            <p ><NavLink to='/datasets/new'onClick={()=>setCurrentState('Create a new dataset')}>Start</NavLink></p>
                        </li>
                        {Boolean(userDetails.token)?(
                            <li className={`nav-item ${currentState==='dataset'?'active':''}`}>
                                <p ><NavLink to='/datasets' onClick={()=>setCurrentState('dataset')}>Dataset</NavLink></p>
                            </li>):''
                        }
                        <li className={`nav-item ${currentState==='Document'?'active':''}`}>
                            <p ><NavLink to='/doc' onClick={()=>setCurrentState('Document')}>Docs</NavLink></p>
                        </li>
                        <li className={`nav-item ${currentState==='Contact us'?'active':''}`}>
                            <p ><NavLink to='/contact' onClick={()=>setCurrentState('Contact us')}>Contact</NavLink></p>
                        </li>
              {Boolean(userDetails.token)?(
                        <li className="nav-item">
                            <p ><NavLink to='/home' onClick={()=>{
                                logout(dispatch)
                                setCurrentState('home');}}>Logout</NavLink></p>
                        </li>):(
                <li className={`nav-item ${currentState==='Sign in'?'active':''}`}>
                    <p ><NavLink to='/users/sign_in' onClick={()=>setCurrentState('Sign in')}>Sign in</NavLink></p>
                </li>)
                }
            </ul>
          </div>
          </div>
        </nav>
      </header>
    )
}
export default NavHeader;