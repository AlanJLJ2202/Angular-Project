const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('Primera Middleware');
  next();
});


app.use((req, res, next) => {
  res.send('Esta es la primer respuesta, desde express');
});

module.exports = app;
