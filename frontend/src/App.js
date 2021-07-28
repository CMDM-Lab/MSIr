import './App.css';
import './stylesheet/theme_responsive.css'
import './stylesheet/theme_style.css'
import "bootstrap/dist/css/bootstrap.min.css";

import Banner from './components/banner'
import FooterCustom from './components/footer_custom'
import NavHeader from './components/nav_header'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useState } from 'react';

function App() {
  const [currentState,setCurrentState]=useState('home')
  const [userSignedIn,setUserSignedIn]=useState(true)
  const [userId,setUserId]=useState()
  return (
      <div className="App">
        <NavHeader userSignedIn={userSignedIn} currentState={currentState} setCurrentState={setCurrentState}/>
        <Banner currentState={currentState}/>
        <Switch>
          {/* Project */}
          {/*
          <Route path='/projects/new' component={createProject}/>
          <Route path='/projects' component={projects}/>
          <Route path='/projects/:projectId' component={projectRender}/>
          
          <Route path='/doc' component={doc}/>
          <Route path='/contact' component={contact}/>
          */}
          {/* User */}
          {/*
          <Route path='/users/sign_in' component={signin}/>
          <Route path='/users/sign_up' component={createUser}/>
          <Route path='/users/password/edit' component={editUserPassword}/>
          <Route path='/users/password/reset' component={resetUserPassword}/>
          <Redirect exact from='/projects' to={userId?`/projects/${userId}`:'/signin'} />
          */}
          <Redirect from='/home' to='/' />
        </Switch>
        <FooterCustom />
      </div>
  );
}

export default App;
