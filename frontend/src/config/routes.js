import Signin from '../components/SignIn'
import Signup from '../components/SignUp'
import Doc from '../components/Doc'
import Contact from '../components/Contact'

const routes =[
  {
    path:'/doc',
    component: Doc,
    isPrivate: false,
  },
  {
    path:'/contact',
    component: Contact,
    isPrivate: false,
  },
  {
    path:'/users/sign_in',
    component: Signin,
    isPrivate: false,
  },
  {
    path:'/users/sign_up',
    component: Signup,
    isPrivate: false,
  },
/*  {
    path:'/projects',
    component: Projects
  },
  {
    path:'/projects/new',
    component: CreateProject
  },
  {
    path:'/projects/:projectId',
    component: ProjectRender
  },*/
  /*
  {
    path:'/users/password/edit',
    component: EditUserPassword
  },
  {
    path:'/users/password/reset',
    component: ResetUserPassword
  },*/
]
 
export default routes