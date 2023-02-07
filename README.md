# MSIr
[MSIr: Automatic Registration Service for Mass Spectrometry Imag-ing and Histology](https://pubs.acs.org/doi/10.1021/acs.analchem.2c04360)

Authors: Bo-Jhang Lin, Tien-Chueh Kuo, Hsin-Hsiang Chung, Ying-Chen Huang, Ming-Yang Wang, Cheng-Chih Hsu, Po-Yang Yao and Yufeng Jane Tseng

## Set up

### Frontend

1. In './frontend/src', create 'config.json' file with below

```
config.json
{
  "API_URL": URL_TO_BACKEND_API,
  "MAX_BYTE_IMZML_FILE": MAX_SIZE_OF_IMZML_FILE_IN_BYTE,
  "MAX_BTYE_IBD_FILE": MAX_SIZE_OF_IBD_FILE_IN_BYTE,
  "MAX_BTYE_HISTOLOGY_FILE": MAX_SIZE_OF_HISTOLOGY_FILE_IN_BYTE
}

```

### Backend

1. In './backend', create './backend/.env' file like './backend/.env.defaults

```
.env
#storage path
#create & specify the temporary folders for histological & MSI data
#for example, assign HIST_storage & MSI_storage in the backend folder and put path here.
#DIR_HIST='/usr/local/app/backend/HIST_storage'
#DIR_MSI='/usr/local/app/backend/MSI_storage'
DIR_HIST=
DIR_MSI=

#JWT
#generate your SECRET string
SECRET=

#For example, DEV PORT=13004
DEV_PORT=

#mail system setting
MAIL_USER=
MAIL_PASS=
MAIL_HOST=
MAIL_PORT=

#Frontend server url
#For example, WEB_URL = "https://localhost:3000"
WEB_URL=

#sqlite DB path
DB_PATH=

#python venv
#PYVENV_ACTIVATE_PATH = 

#API
#For example, API_URL =  "https://localhost:13004"
API_URL = 
API_KEY = 

#example file path
## Put sample files in the backend folder as the example
EXAMPLE_IMZML="/usr/local/app/backend/a15-3.imzml"
EXAMPLE_IDB="/usr/local/app/backend/a15-3.ibd"
EXAMPLE_HISTOLOGY="/usr/local/app/backend/a15-3_he_noline.jpg"

```

3. Build Docker image, create containers and attache to containers for the MSIr service

```
docker-compose up --build
```
After building and starting up the MSIr service, go to http://localhost:13001 and start MSI registrations.

To stop the MSIr service, press ctrl-C.
