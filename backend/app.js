const express = require('express');
const bodyparser = require('body-parser');

const app = express();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.post('/api.posts', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.use('/api.posts', (req, res, next) => {

  const posts = [
    { id: 'fadf12421l', title: 'First server-side post', content: 'This is coming from the server' },
    { id: 'ksajflaj132', title: 'Second server-side post', content: 'This is coming from the server!' }
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});


app.use((req, res, next) => {
  res.send('Esta es la primer respuesta, desde express');
});

module.exports = app;
