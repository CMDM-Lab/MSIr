import './App.css';
import './stylesheet/theme_responsive.css'
import './stylesheet/theme_style.css'
import Banner from './components/banner'
import FooterCustom from './components/footer_custom'
import NavHeader from './components/nav_header'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { useState } from 'react';

function App() {
  const [currentState,setCurrentState]=useState('home')
  const [userSignedIn,setUserSignedIn]=useState(true)
  const [userId,setUserId]=useState()
  return (
    <BrowserRouter>
      <div className="App">
        <NavHeader userSignedIn={userSignedIn} currentState={currentState} setCurrentState={setCurrentState}/>
        <Banner currentState={currentState}/>
        <Switch>
          {/* Project */}
          <Route path='/start' component={createProject}/>
          <Route path='/projects/:userId' component={projects}/>
          <Route path='/projects/:userId/:projectId' component={projectRender}/>
          
          <Route path='/doc' component={doc}/>
          <Route path='/contact' component={contact}/>
          <Route path='/signin' component={signin}/>
          {/* User */}
          <Route path='/createUser' component={createUser}/>
          <Route path='/editUserPassword' component={editUserPassword}/>
          <Route path='/resetUserPassword' component={resetUserPassword}/>
          <Redirect exact from='/projects' to={userId?`/projects/${userId}`:'/signin'} />
          <Redirect from='/home' to='/' />
        </Switch>
        <FooterCustom />
      </div>
    </BrowserRouter>
  );
}

export default App;
