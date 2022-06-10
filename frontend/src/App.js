import './stylesheet/theme_responsive.css'
import './stylesheet/theme_style.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

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
import EditUserPassword from './components/auth/EditUserPassword';
import ResetRequire from './components/auth/ResetRequire';


function App() {
  const [currentState,setCurrentState]=useState('home')
  const [userSignedIn,]=useState(true)
  
  return (
      <div className="App">
        <NavHeader userSignedIn={userSignedIn} currentState={currentState} setCurrentState={setCurrentState}/>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/doc' component={Doc} />
          <Route path='/contact' component={Contact} />
          <Route path='/users/sign_in' component={SignIn} />
          <Route path='/users/sign_up' component={Signup} />
          <Route path='/users/password/edit/:reset_password_token' component={EditUserPassword} />
          <Route path='/users/password/reset' component={ResetRequire} />
        {routes.map((route) => (
            <AppRoute
              key={route.path}
              path={route.path}
              component={route.component}
              isPrivate={route.isPrivate}
              isExact = {route.isExact}
            />
          ))}
          <Redirect from='/home' to='/' />
        </Switch>
        <FooterCustom />
      </div>
  );
}

export default App;
