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


// RESTful Routes

app.get("/", (req, res) => {
   res.redirect("/blogs"); 
});

// Index Route
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, allBlogs) => {
        if(err)
            console.error(err);
        else 
            res.render("index", {blogs: allBlogs})
    }) 
});

// New route
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

// Create Route
app.post("/blogs", (req, res) => {
    // Sanitize the body of the blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog , (err, newBlog) => {
        if(err)
            console.error(err);
        else
            res.redirect("/blogs");
    })
});

// Show Route
app.get("/blogs/:id" , (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err)
            console.error(err);
        else 
            res.render("show", {blog: foundBlog});
    })
});

// Edit Route
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err)
            console.error(err);
        else 
            res.render("edit", {blog: foundBlog});
    })
});

// Update Route
app.put("/blogs/:id", (req, res) => {
    // Sanitize the body of the blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, {'useFindAndModify': false}, (err, updatedBlog) => {
        if(err)
            console.error(err);
        else  {
            // Note: If we just do res.render("show", {blog: updatedBlog}), it'll call the url " /blogs/:id?_method=PUT " which doesn't display the updated blog though but if we visit " /blogs/:id " it'll be updated
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Delete Route
app.delete("/blogs/:id", (req, res) => {
   Blog.findByIdAndRemove(req.params.id, {'useFindAndModify': false}, (err) => {
        if(err)
            console.error(err);
        else 
            res.redirect("/blogs");
   })
});

