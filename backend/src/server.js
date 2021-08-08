import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
    origin: "http://localhost:8081"
  };
  
app.use(cors(corsOptions));

  

const server = app.listen(process.env.PORT || 8080, function () {
    console.log('Listening on port ' + server.address().port);
  });