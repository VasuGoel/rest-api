const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override'),
      expressSanitizer = require('express-sanitizer');

// App Config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// Mount express-sanitizer middleware here (after body-parser)
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Mongoose Config/ blogSchema/ Blog Model
mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true});

const blogSchema = mongoose.Schema({
    author: String,
    title: String, 
    image: String,
    body: String,
    // Any time you save a document with an unset time field, Mongoose will fill in this field with the current time.
    date: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

