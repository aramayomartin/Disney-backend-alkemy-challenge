// To handle back
var express = require('express');
var router = express.Router();
// Global variables
require('dotenv').config();
// To handle sessions
const validateToken = require('../auth/validateToken.js')
// Import routes
const register = require('./register.js');
const login = require('./login.js');
const Characters = require('./Characters.js');
const Movies = require("./Movies.js");

// routes to handle sessions
router.use('/',register);
router.use('/',login);
//characters, list and CRUD
router.use('/',Characters);
//movies
router.use('/',Movies);


module.exports = router;
