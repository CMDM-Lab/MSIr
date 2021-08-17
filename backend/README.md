# API

## Auth

- post /api/auth/signin
- post /api/auth/signup
- post /api/auth/reset_req
- post /api/auth/reset

## Projects

- get /api/projects/all?userid= (拿所有projects by userId)
- get /api/projects/show?projectid= (拿data by projectId)
- post /api/projects/example?user= (建立example project)
- post /api/projects/edit?projectid= (編輯project by projectid)
- post /api/projects/new?userid= (建立project)
- post /api/projects/delete?projectid= (刪除project)

## MSI DATA

- post /api/msi/new?projectid= (上傳file)
- post /api/msi/update?projectid= (上傳其他file，原file刪除並覆寫資料庫)
- post /api/msi/sumbit?projectid= (編輯)

## Histology Image

- post /api/histology/new?projectid= (上傳file)
- post /api/histology/update?projectid= (上傳其他file，原file刪除並覆寫資料庫)
- get /api/histology/show?histologyid= (取影像by id)

## Histology ROI

- post /api/roi/new?histologyid= (建立新的roi)
- get /api/roi/show?roiid= (取roi影像)
- get /api/roi/points?roiid= (取roi points data)
- get /api/roi/allmask?histologyid= (取mask list by histologyid)
- get /api/roi/allroi?histologyid= (取roi list by histologyid)

## Registrations

- post /api/registrations/new? (要包含Mask Id)
- post /api/registrations/delet?registrationid=
- get /api/registrations/all?projectid= (取registration list)
- get /api/registrations/show?registrationid= (取registration)
- get /api/registrations/resultimg?registrationid= (取registration eval img)
- get /api/registrations/matrixfile?registrationid= (取registration matrix file)
- get /api/registrations/idxfile?registrationid= (取registration index file)

## Extraction

- post /api/extractions/new? (要包含roi id)
- post /api/extractions/delete?extractionid= 
- get /api/extractions/all?projectid= (取extraction list)
- get /api/extractions/show?extractionid= (取extraction)
- get /api/extractions/resultfile?extractionid= (取extraction result file)