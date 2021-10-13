import DatasetRender from '../components/dataset/DatasetRender'
import Datasets from '../components/dataset/Datasets'
import CreateRegistration from '../components/registration/CreateRegistration'
import CreateExtraction from '../components/extraction/CreateExtraction'
import Registrations from '../components/registration/Registrations'
import Extractions from '../components/extraction/Extractions'
import RegistrationRender from '../components/registration/RegistrationRender'
import CreateDataset from '../components/dataset/CreateDataset'
import DatasetEdit from '../components/dataset/DatasetEdit'
import UploadMSI from '../components/msidata/UploadMSI'
import EditMSI from '../components/msidata/EditMSI'
import HistologyROI from '../components/roi/HistologyROI'
import UploadImage from '../components/image/UploadImage'
import EditImage from '../components/image/EditImage'



const routes =[
  {
    path:'/datasets/:datasetId/msi/new',
    component: UploadMSI,
    //isPrivate: true,
  },
  {
    path:'/datasets/:datasetId/msi/edit',
    component: EditMSI,
    //isPrivate: true,
  },
  {
    path:'/datasets/:datasetId/image/new',
    component: UploadImage,
    isPrivate: true,
  },
  {
    path:'/datasets/:datasetId/image/edit',
    component: EditImage,
    isPrivate: true,
  },
  {
    path:'/datasets/:datasetId/image/roi',
    component: HistologyROI,
    isPrivate: true,
  },
  {
    path:'/datasets/:datasetId/extractions/new',
    component: CreateExtraction,
    //isPrivate: true,
  },
  {
    path:'/datasets/:datasetId/registrations/new',
    component: CreateRegistration,
    //isPrivate: true,
  },
  {
    path:'/datasets/:datasetId/registrations/:regId',
    component: RegistrationRender,
    //isPrivate: true,
  },
  /*{
    path:'/datasets/:datasetId/extracts/:extractId',
    component: ExtractionRender
  },*/
  {
    path:'/datasets/:datasetId/edit',
    component: DatasetEdit,
    //isPrivate: true,
  },
  {
    path:'/datasets/:datasetId/registrations',
    component: Registrations,
    //isPrivate: true,
  },
  {
    path:'/datasets/:datasetId/extractions',
    component: Extractions,
    //isPrivate: true,
  },
  {
    path:'/datasets/new',
    component: CreateDataset,
    //isPrivate: true,
  },
  {
    path:'/datasets/:datasetId',
    component: DatasetRender,
    //isPrivate: true,
  },
  
  {
    path:'/datasets',
    component: Datasets,
    //isPrivate: true,
  },/*
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