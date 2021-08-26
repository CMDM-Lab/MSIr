# API

## Auth

- post /api/auth/signin
  - email
  - password
- post /api/auth/signup
  - email
  - password
- post /api/auth/reset_req
- post /api/auth/reset

## Projects

- get /api/projects/all (拿所有projects by userId)
- get /api/projects/show (拿data by projectId)
  - projectId
- post /api/projects/example (建立example project)
  - projectId
- put /api/projects/edit (編輯project by projectid)
  - name
  - description
- post /api/projects/new (建立project)
  - name
  - description
- delete /api/projects/delete (刪除project)
  - projectId

## MSI DATA

- post /api/msi/new?projectid= (上傳file)
  - projectId
  - userId
- post /api/msi/update?projectid= (上傳其他file，原file刪除並覆寫資料庫)
  - msiId
- post /api/msi/sumbit?projectid= (編輯)
  - msiId
  - bin_size
  - pixel_size

## Histology Image

- post /api/histology/new?projectid= (上傳file)
  - projectId
  - userId
- post /api/histology/update?projectid= (上傳其他file，原file刪除並覆寫資料庫)
  - histologyImageId
- get /api/histology/show?histologyid= (取影像by id)

## Histology ROI

- post /api/roi/new?histologyid= (建立新的roi)
  - roi_type
  - points
  - histologyImageId
- get /api/roi/show?roiid= (取roi影像)
- get /api/roi/all?roiid= (取roi points data)
  - histologyImageId
- get /api/roi/allmask?histologyid= (取mask list by histologyid)
  - histologyImageId
- get /api/roi/allroi?histologyid= (取roi list by histologyid)
  - histologyImageId
- post /api/roi/get_parameter (script拿資料)
  - histologyImageId
  - roiId
- post /api/roi/set_parameter (script回傳資料)
  - roiId
  - status
  - result_file

## Registrations

- post /api/registrations/new (要包含Mask Id)
  - projectId
  - perform_type
  - transform_type
- delete /api/registrations/delete
  - registrationId
- get /api/registrations/all (取registration list)
  - projectId
- get /api/registrations/show (取registration)
  - registrationId
- get /api/registrations/resultimg?registrationid= (取registration eval img)
- get /api/registrations/matrixfile?registrationid= (取registration matrix file)
- get /api/registrations/idxfile?registrationid= (取registration index file)
- post /api/registrations/get_parameter (script拿資料)
  - registrationId
- post /api/registrations/set_parameter (script回傳資料)
  - status
  - registrationId
  - transform_matrix_file
  - result_file
  - min_mz
  - max_mz
  - msi_h
  - msi_w
  - processed_data_file

## Extraction

- post /api/extractions/new (要包含roi id)
  - normalization
  - projectId
- delete /api/extractions/delete
  - extractionId
- get /api/extractions/all?projectid= (取extraction list)
  - projectId
- get /api/extractions/show?extractionid= (取extraction)
  - extractionId
- get /api/extractions/resultfile?extractionid= (取extraction result file)
- post /api/extractions/get_parameter (script取資料)
  - extractionId
- post /api/extractions/set_parameter (script回傳資料)
  - extractionId
  - status
  - extract_file
