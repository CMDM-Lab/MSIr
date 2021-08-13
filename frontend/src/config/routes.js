import Signin from '../components/auth/SignIn'
import Signup from '../components/auth/SignUp'
import Doc from '../components/public/Doc'
import Contact from '../components/public/Contact'
import ProjectRender from '../components/project/ProjectRender'
import Projects from '../components/project/Projects'
import CreateRegistration from '../components/registration/CreateRegistration'
import CreateExtraction from '../components/extraction/CreateExtraction'
import Registrations from '../components/registration/Registrations'
import Extractions from '../components/extraction/Extractions'
import RegistrationRender from '../components/registration/RegistrationRender'
import CreateProject from '../components/project/CreateProject'
import ProjectEdit from '../components/project/ProjectEdit'
import UploadMSI from '../components/msidata/UploadMSI'

const routes =[
  {
    path:'/doc',
    component: UploadMSI,
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
  },
  {
    path:'/projects/:projectId/regs',
    component: Registrations
  },
  {
    path:'/projects/:projectId/regs/new',
    component: CreateRegistration
  },
  {
    path:'/projects/:projectId/regs/:regId',
    component: RegistrationRender
  },
  {
    path:'/projects/:projectId/extracts',
    component: Extractions
  },
  {
    path:'/projects/:projectId/extracts/new',
    component: CreateExtraction
  },
  {
    path:'/projects/:projectId/extracts/:extractId',
    component: ExtractionRender
  },
  {
    path:'/projects/:projectId/image',
    component: 
  },
  {
    path:'/projects/:projectId/image/roi',
    component: Extractions
  },
  */
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