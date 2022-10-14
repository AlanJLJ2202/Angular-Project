const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose')

const Post = require('./models/post');
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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.post('/api.posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save();

  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.use('/api.posts', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    });
  });
});


app.delete('/api.posts.delete/:id', (req, res) => {

  Post.findByIdAndDelete(req.params.id).then((resultado) => {
    if (!resultado) {
        return res.status(404).send();
    }
    res.send(resultado);
  }).catch((error) => {
    res.status(500).send(error);
  })

});



app.use((req, res, next) => {
  res.send('Esta es la primer respuesta, desde express');
});

module.exports = app;
