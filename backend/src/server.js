import express from 'express';
import cors from 'cors';
import auth from './routes/auth.routes'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
    origin: "http://localhost:8081"
  };
  
app.use(cors(corsOptions));

app.use('/api/auth',auth)
app.use('/api/project')
app.use('/api/msi')
app.use('/api/histology')
app.use('/api/roi')
app.use('/api/registration')
app.use('/api/extraction')

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

const server = app.listen(process.env.PORT || 8080, function () {
    console.log('Listening on port ' + server.address().port);
  });