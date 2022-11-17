const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose')
const path = require('path');

const postRoute = require('./routes/posts');
const app = express();


mongoose.connect('mongodb+srv://alanjlj2202:tm9PSFicMndbFBJs@cluster0.pqfst4r.mongodb.net/webdev?retryWrites=true&w=majority')
.then(() => {
  console.log('Base de datos conectada');
})
.catch(() => {
  console.log('Conexión fallida :(');
})


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/api.posts", postRoute);

module.exports = app;
