const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Extensión no valida');
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }

});

router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });

  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...result,
        id: result._id
      }
  });})

  console.log(post);
});




router.get("/:id", (req, res) => {
  console.log('SE EJECUTA EL GET EN SERVIDOR');
  Post.findById(req.params.id).then(post => {
    if(post){
      console.log('post === ', post);
      res.status(200).json(post);
    }else{
      res.status(404).json({message: 'Post no encontrado'});
    }
  });
});


router.delete('/delete/:id', (req, res) => {

  console.log('entra a la funcion');
  Post.findByIdAndDelete(req.params.id).then((resultado) => {
    if (!resultado) {
        return res.status(404).send();
    }
    res.send(resultado);
  }).catch((error) => {
    res.status(500).send(error);
  });

});

router.put('/:id', (req, res, next) => {

    console.log('Se ejecuta en posts.js');

    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content
    });

    Post.updateOne({_id: req.params.id}, post).then(resultado => {
      console.log(resultado);
      res.status(200).json({message: 'Updated successfully!'});
    });

});

router.use('', (req, res) => {
  Post.find().then(documents => {
    console.log('SE EJECUTA EL MIDDLEWARE');
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    });
  });
});





module.exports = router;
