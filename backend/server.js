import express from 'express';
import cors from 'cors';
import auth from './src/routes/auth.routes'
import histology from './src/routes/histology.routes'
import dataset from './src/routes/datasets.routes'
import msi from './src/routes/msi.routes'
import extract from './src/routes/extractions.routes'
import registration from './src/routes/registrations.routes'
import roi from './src/routes/roi.routes'
import db from './src/db/db'
import dotenv from 'dotenv-defaults'

const app = express();

dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
    origin: "http://localhost:3000"
  };
  
app.use(cors(corsOptions));

//set static path 
app.use('/api/upload',express.static(process.env.DIR_HIST))

app.use('/api/auth', auth)
app.use('/api/datasets', dataset)
app.use('/api/msi', msi)
app.use('/api/histology', histology)
app.use('/api/roi', roi)
app.use('/api/registrations', registration)
app.use('/api/extractions', extract)

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.use((error, req, res, next) => {
  console.log('This is the rejected field ->', error.field);
});

db.sync()

const server = app.listen(process.env.PORT || 8080, function () {
    console.log('Listening on port ' + server.address().port);
  });