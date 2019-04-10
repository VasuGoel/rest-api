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