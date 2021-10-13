import express from 'express';
import cors from 'cors';
import {auth, histology, dataset, msi, extract, registration, job} from './src/routes'
import roi from './src/routes/roi.routes'
import db, { User } from './src/db/db'
import dotenv from 'dotenv-defaults'
import bcrypt from 'bcrypt'
//import { activatePyvevn } from './src/utils/runScript';

const app = express();

dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//activate python venv (has some problem need to solve)
//activatePyvevn()

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
app.use('/api/job', job)

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to MSI Registrar II API." });
});

app.use((error, req, res, next) => {
  console.log('This is the rejected field ->', error.field);
});

//connect DB
db.sync()

//Create guest user


const server = app.listen(process.env.PORT || 8080, function () {
    console.log('Listening on port ' + server.address().port);
    const guest = User.findOrCreate({
    where: {
      email: 'guest@guest.com',
    },
    defaults: {encrypted_password: bcrypt.hashSync('guestguest', 8)}
  })
  });