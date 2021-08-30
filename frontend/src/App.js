//import './App.css';
import './stylesheet/theme_responsive.css'
import './stylesheet/theme_style.css'
import "bootstrap/dist/css/bootstrap.min.css";

//import Banner from './components/public/Banner'
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


function App() {
  const [currentState,setCurrentState]=useState('home')
  const [userSignedIn,setUserSignedIn]=useState(true)
  
  return (
      <div className="App">
        <NavHeader userSignedIn={userSignedIn} currentState={currentState} setCurrentState={setCurrentState}/>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/doc' component={Doc} />
          <Route path='/contact' component={Contact} />
          <Route path='/users/sign_in' component={SignIn} />
          <Route path='/users/sign_up' component={Signup} />
          {/*<Route exact path='/datasets' component={Datasets} />
          <Route exact path='/datasets/new' component={CreateDataset} />
          <Route exact path='/datasets/:datasetId' component={DatasetRender} />
  <Route exact path='/datasets/:datasetId/edit' component={DatasetEdit} />*/}
        {routes.map((route) => (
            <AppRoute
              key={route.path}
              path={route.path}
              component={route.component}
              isPrivate={route.isPrivate}
              isExact = {route.isExact}
            />
          ))}
          
          {/* Dataset */}
          {/*
          <Route path='/datasets/new' component={createDataset}/>
          <Route path='/datasets' component={Datasets}/>
          <Route path='/datasets/:datasetId' component={datasetRender}/>
          
          <Route path='/doc' component={doc}/>
          <Route path='/contact' component={contact}/>
          */}
          {/* User */}
          {/*
          <Route path='/users/sign_in' component={signin}/>
          <Route path='/users/sign_up' component={createUser}/>
          <Route path='/users/password/edit' component={editUserPassword}/>
          <Route path='/users/password/reset' component={resetUserPassword}/>
          <Redirect exact from='/datasets' to={userId?`/datasets/${userId}`:'/signin'} />
          */}
          <Redirect from='/home' to='/' />
        </Switch>
        <FooterCustom />
      </div>
  );
}

export default App;
