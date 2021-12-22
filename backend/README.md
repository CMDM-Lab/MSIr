# Setup

1. Run

```
yarn install
```

2. Create './.env' file like './.env.defaults

```
.env
#storage path
DIR_HIST=
DIR_MSI=

#JWT
SECRET=

#DEV PORT
DEV_PORT=

#mail system setting
MAIL_USER=
MAIL_PASS=
MAIL_HOST=
MAIL_PORT=

#Frontend server url
WEB_URL=

#sqlite DB path
DB_PATH=

#python venv
PYVENV_ACTIVATE_PATH = 

#API
API_URL = 
API_KEY = 

#example file path
EXAMPLE_IMZML=
EXAMPLE_IDB=
EXAMPLE_HISTOLOGY=

```

3. Install python packages (../requirment.txt)

```
# Python >= 3.8.2
# Package
numpy==1.20.0
numba==0.54.0
itk-elastix==0.13.0
umap-learn==0.5.1
opencv-python==4.5.3.56
scipy==1.7.1
pyimzML==1.5.1
scikit-learn==0.24.2
requests==2.26.0
python-dotenv==0.19.0
ms-peak-picker==0.1.33

```

# API

## Auth

- POST  /api/auth/signin
  - input
    - email
    - password
- POST /api/auth/signup
  - input
    - email
    - password
- POST /api/auth/reset_req
  - input
    - email
- POST /api/auth/reset
  - input
    - reset_password_token
    - password

## Datasets

- GET /api/datasets/all (Acquire all datasets based on userId)
  - input
    - userId
- GET /api/datasets/show (Acquire a dataset information by datasetId)
  - input
    - datasetId
- POST /api/datasets/example (create example dataset)
- PUT /api/datasets/edit (edit a dataset based on datasetId)
  - input
    - name
    - description
- POST /api/datasets/new (create a dataset based on datasetId)
  - input
    - name
    - description
- DELETE /api/datasets/delete (delete a dataset based on datasetId)
  - input
    - datasetId

## MSI DATA

- POST /api/msi/new (Upload files, if the same data format is uploaded, old file is deleted and information in database is rewritten)
  - input
    - datasetId
    - file
- POST /api/msi/sumbit (Submit MSI data information)
  - input
    - msiId
    - bin_size
    - pixel_size
- GET /api/msi/get (Acquire MSI data information)
  - input
    - datasetId

## Histology Image

- POST /api/histology/new (Upload a file, if other file is uploaded, old file is deleted and information in database is rewritten)
  - input
    - datasetId
    - file
- POST /api/histology/submit (Submit image information)
  - input
    - histologyImageId
    - resolution
- GET /api/histology/information (Acquire image information by datasetId)
  - input
    - datasetId

## Histology ROI

- POST /api/roi/new (Create a new roi)
  - input
    - userId
    - roi_type
    - points
    - histologyImageId
    - datasetId
- GET /api/roi/all (取roi points data)
  - input
    - histologyImageId
- GET /api/roi/allmask?histologyid= (Acquire mask list by histologyid)
- GET /api/roi/allroi?histologyid= (Acquire roi list by histologyid)
- DELETE /api/roi/delete  (Delete a ROI)
- POST /api/roi/new_batch (Create new rois in batch)
- POST /api/roi/get_parameter (Acquire data for script)
- POST /api/roi/set_parameter (Set data from script)

## Registrations

- POST /api/registrations/new (Create a new registration task)
- DELETE /api/registrations/delete (Delete a registration task (no-running))
- GET /api/registrations/all (Acquire registration list)
- GET /api/registrations/show (Acquire information of a registration)
- POST /api/registrations/get_parameter (Acquire information for script)
  - input
    - registrationId
- POST /api/registrations/set_parameter (Set information from script)
  - input
    - status
    - registrationId
    - transform_matrix_file
    - result_file
    - min_mz
    - max_mz
    - msi_h
    - msi_w
    - processed_data_file
    - ......

## Extraction

- POST /api/extractions/new (Create a new extraction task)
- DELETE /api/extractions/delete (Delete a extraction task)
  - extractionId
- GET /api/extractions/all (Acquire extraction list)
  - input
    - datasetId
- GET /api/extractions/show (Acquire an extraction informaiton)
  - input
    - extractionId
- POST /api/extractions/get_parameter (Acquire information for script)
  - input
    - extractionId
- POST /api/extractions/set_parameter (Set information from script)
  - input
    - extractionId
    - status
    - extract_file
