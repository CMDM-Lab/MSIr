# MSI_Registrar_v2

## Todo

Backend

- Quota and periodical remove file script (python)

## Set up

### Frontend

1. In './frontend', run

```
yarn install
```

2. In './frontend/src', create 'config.json' file with below

```
config.json
{
  "API_URL": URL_TO_BACKEND_API,
  "MAX_BYTE_IMZML_FILE": MAX_SIZE_OF_IMZML_FILE_IN_BYTE,
  "MAX_BTYE_IBD_FILE": MAX_SIZE_OF_IBD_FILE_IN_BYTE,
  "MAX_BTYE_HISTOLOGY_FILE": MAX_SIZE_OF_HISTOLOGY_FILE_IN_BYTE
}

```

3. In './frontend', follow './frontend/README.md' to bulid

### Backend

1. In './backend', run

```
yarn install
```

2. In './backend', create './backend/.env' file like './backend/.env.defaults

```
.env
#storage path
DIR_HIST=
DIR_MSI=
#JWT
SECRET=
#Port
PORT=
#mail system setting
MAIL_USER=
MAIL_PASS=
MAIL_HOST=
#Frontend server url
WEB_URL=
#sqlite DB path
DB_PATH=
#python venv
PYVENV_ACTIVATE_PATH = 
#API
API_URL = 
API_KEY = 
#Example file path
EXAMPLE_IMZML=
EXAMPLE_IDB=
EXAMPLE_HISTOLOGY=

```

3. Install python packages

```
pip install -r requirement.txt
```

## Prerequisite

### Python packages

- numpy
- numba
- scipy
- scikit-learn
- requests
- python-dotenv
- Opencv-python
- itk-elastix
- umap-learn
- ms_peak_picker
- pyimzML

### Frontend

- react
- react-dom
- react-router-dom
- axios
- web-vitals

### Backend

- bcrypt
- cors
- dotenv-defaults
- express
- jsonwebtoken
- multer
- nodemailer
- sequelize
- sqlite3
- babel
- nodemon

### 3rd party libraries

- react-image-annotate
- react-image-picker
- react-validation
- validator
- bootstrap
- sweetalert2
- sweetalert2-react-content
- rpldy
- rc-progress
