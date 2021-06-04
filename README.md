# MSI_Registrar_2

## Todo

### Frontend

- View
  - Web base view
    - home
    - document
    - contact
    - login and logout
  - Web user registration
    - account name
    - password
    - e-mail (check valid and non repeat)
  - Web edit and reset password
    - By account name and e-mail
  - Project list
  - Project create, setting, and file upload
  - MSI visualization
    - Mean spectrum
    - m/z ion image
    - Hyperspectral visualization
  - ROI interface (Histology and MSI)
    - polygon model
  - Result page
    - Result evaluation?
    - File download
    - Setting modify and re-run
    - Extract data with ROI
- Web document
- Web of login and logout
- User authentication
- Web of analysis setting
  - File upload function   ()
- ROI interface (polygon and pen)
- Extract by m/z or ROI
- Image viewer

### Backend #

- Queue jobs
- Quota and periodical remove file script (python)
- Run script
  - Generate the histology mask
  - Generate the MSI mask
  - Automatic registration
  - Extract data by roi
  - Extract data by m/z
- Database
  - User information
    - User id
    - account name
    - password
    - email
    - token
  - User-project
    - User id
    - project id
    - project name
    - histology image
    - MSI data
    - histology mask
    - MSI mask
  - Project-ROI
    - Project id
    - ROI id
    - ROI points
    - ROI label
  - Project-Registration
    - Project id
    - registration id
    - parameter setting
    - evaluation image
    - transformation parameter (files_path)
    - result index
  - Registration-Extraction
    - registration id
    - extraction id
    - extraction type
    - extraction condition
      - ROI
      - m/z (start-end)
    - extraction result
- email system
  - status
  - finish
  - password reset

## Prerequisite #

### Python modules ##

- Opencv-python
- numpy
- requests
- python-dotenv
- itk-elastix
- PHATE
- umap-learn

### Frontend ##

### Backend ##

### 3rd party libraries ##
