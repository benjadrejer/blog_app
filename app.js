var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var app = express();

mongoose.connect('mongodb://localhost/restful_blog_app', { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now},
});

var Blog = mongoose.model("Blog", blogSchema);

// Routes
app.get('/', function(req, res) {
  res.redirect('/blogs');
})

app.get('/blogs', function(req, res) {
  Blog.find({}, function(err, blogs) {
    if(err) {
      console.log("ERROR");
    } else {
      res.render("index", {blogs})
    }
  });
});

app.get('/blogs/new', function(req, res) {
  res.render('new');
});

app.post('/blogs', function(req, res) {
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, post) {
    if (err) {
      res.redirect('/index');
    } else {
      res.render('show', { blog: post});
    }
  })
});

app.get('/blogs/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(err, post) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', {blog: post});
    }
  });
});

app.put('/blogs/:id', function(req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, post) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

app.delete('/blogs/:id', function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  })
});

app.listen(8080, function() {
  console.log('SERVER IS RUNNING');
});