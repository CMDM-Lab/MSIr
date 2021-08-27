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
  {
    path:'/projects/:projectId/msi/new',
    component: UploadMSI,
    //isPrivate: true,
  },
  {
    path:'/projects/:projectId/msi/edit',
    component: EditMSI,
    //isPrivate: true,
  },
  /*{
    path:'/projects/:projectId/image',
    component: ,
    isPrivate: true,
  },
  {
    path:'/projects/:projectId/image/roi',
    component: ,
    isPrivate: true,
  },*/
  {
    path:'/projects/:projectId/extractions/new',
    component: CreateExtraction,
    //isPrivate: true,
  },
  {
    path:'/projects/:projectId/registrations/new',
    component: CreateRegistration,
    //isPrivate: true,
  },
  {
    path:'/projects/:projectId/registrations/:regId',
    component: RegistrationRender,
    //isPrivate: true,
  },
  /*{
    path:'/projects/:projectId/extracts/:extractId',
    component: ExtractionRender
  },*/
  {
    path:'/projects/:projectId/edit',
    component: ProjectEdit,
    //isPrivate: true,
  },
  {
    path:'/projects/:projectId/registrations',
    component: Registrations,
    //isPrivate: true,
  },
  {
    path:'/projects/:projectId/extractions',
    component: Extractions,
    //isPrivate: true,
  },
  {
    path:'/projects/new',
    component: CreateProject,
    //isPrivate: true,
  },
  {
    path:'/projects/:projectId',
    component: ProjectRender,
    //isPrivate: true,
  },
  
  {
    path:'/projects',
    component: Projects,
    //isPrivate: true,
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