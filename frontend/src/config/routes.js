const routes =[
  {
    path:'/',
    component: Login
  },
  {
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
    path:'/doc',
    component: Doc
  },
  {
    path:'/contact',
    component: Contact
  },
  {
    path:'/users/sign_in',
    component: Signin
  },
  {
    path:'/users/sign_up',
    component: CreateUser
  },
  {
    path:'/users/password/edit',
    component: EditUserPassword
  },
  {
    path:'/users/password/reset',
    component: ResetUserPassword
  },
]
 
export default routes