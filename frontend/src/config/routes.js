import Signin from '../components/auth/SignIn'
import Signup from '../components/auth/SignUp'
import Doc from '../components/public/Doc'
import Contact from '../components/public/Contact'
import ProjectRender from '../components/project/ProjectRender'

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
  },
  {
    path:'/projects/:projectId/edit',
    component: ProjectEdit
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