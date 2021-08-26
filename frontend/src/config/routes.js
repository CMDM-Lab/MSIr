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
import EditMSI from '../components/msidata/EditMSI'

const routes =[
  /*{
    path:'/projects',
    component: Projects,
    //isPrivate: true,
    isExact: true
  },*/
  {
    path:'/projects/new',
    component: CreateProject,
    //isPrivate: true,
    isExact: true
  }, 
  {
    path:'/projects/:projectId/edit',
    component: ProjectEdit,
    //isPrivate: true,
    isExact: true
  },
  {
    path:'/projects/:projectId',
    component: ProjectRender,
    //isPrivate: true,
    isExact: true
  },
 
  {
    path:'/projects/:projectId/regs',
    component: Registrations,
    //isPrivate: true,
    isExact: true
  },
  {
    path:'/projects/:projectId/regs/new',
    component: CreateRegistration,
    //isPrivate: true,
    isExact: true
  },
  {
    path:'/projects/:projectId/regs/:regId',
    component: RegistrationRender,
    //isPrivate: true,
    isExact: true
  },
  {
    path:'/projects/:projectId/extracts',
    component: Extractions,
    //isPrivate: true,
    isExact: true
  },
  {
    path:'/projects/:projectId/extracts/new',
    component: CreateExtraction,
    //isPrivate: true,
    isExact: true
  },
  /*{
    path:'/projects/:projectId/extracts/:extractId',
    component: ExtractionRender
  },*/
  /*{
    path:'/projects/:projectId/image',
    component: ,
    isPrivate: true,
    isExact: true
  },
  {
    path:'/projects/:projectId/image/roi',
    component: ,
    isPrivate: true,
    isExact: true
  },*/
  {
    path:'/projects/:projectId/msi/new',
    component: UploadMSI,
    //isPrivate: true,
    isExact: true
  },
  {
    path:'/projects/:projectId/msi/edit',
    component: EditMSI,
    //isPrivate: true,
    isExact: true
  },
  
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