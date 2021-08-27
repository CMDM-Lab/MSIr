//import './App.css';
import './stylesheet/theme_responsive.css'
import './stylesheet/theme_style.css'
import "bootstrap/dist/css/bootstrap.min.css";

import Banner from './components/public/Banner'
import FooterCustom from './components/public/FooterCustom'
import NavHeader from './components/public/NavHeader'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useState } from 'react';
import AppRoute from './components/AppRoute';
import routes from './config/routes'
import Home from './components/public/Home';
import Doc from './components/public/Doc';
import Contact from './components/public/Contact';
import SignIn from './components/auth/SignIn';
import Signup from './components/auth/SignUp'
import Projects from './components/project/Projects';
import CreateProject from './components/project/CreateProject';
import ProjectRender from './components/project/ProjectRender';
import ProjectEdit from './components/project/ProjectEdit';


function App() {
  const [currentState,setCurrentState]=useState('home')
  const [userSignedIn,setUserSignedIn]=useState(true)
  
  return (
      <div className="App">
        <NavHeader userSignedIn={userSignedIn} currentState={currentState} setCurrentState={setCurrentState}/>
        <Banner currentState={currentState}/>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/doc' component={Doc} />
          <Route path='/contact' component={Contact} />
          <Route path='/users/sign_in' component={SignIn} />
          <Route path='/users/sign_up' component={Signup} />
          {/*<Route exact path='/projects' component={Projects} />
          <Route exact path='/projects/new' component={CreateProject} />
          <Route exact path='/projects/:projectId' component={ProjectRender} />
  <Route exact path='/projects/:projectId/edit' component={ProjectEdit} />*/}
        {routes.map((route) => (
            <AppRoute
              key={route.path}
              path={route.path}
              component={route.component}
              isPrivate={route.isPrivate}
              isExact = {route.isExact}
            />
          ))}
          
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
