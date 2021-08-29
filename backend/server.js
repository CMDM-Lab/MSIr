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
/*
//set static path 
app.use('',express.static(__dirname + ''))
*/
app.use('/api/auth', auth)
app.use('/api/dataset', dataset)
app.use('/api/msi', msi)
app.use('/api/histology', histology)
app.use('/api/roi', roi)
app.use('/api/registration', registration)
app.use('/api/extraction', extract)

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

db.sync()

const server = app.listen(process.env.PORT || 8080, function () {
    console.log('Listening on port ' + server.address().port);
  });