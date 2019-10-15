const express = require("express");
const fs = require('fs');
const path = require("path");
const morgan = require("morgan");
const mongoose = require('mongoose');
const subdomain = require("express-subdomain");
const bodyParser = require("body-parser");
const passport = require("passport");
const store = require("express-session").Store;
const mongooseStore = require("mongoose-express-session")(store);
const { appConfig } = require('./setup')();
const apiRouter = require("../routes/api");


// Mongoose setup and config
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

// appConfig.dbPath
mongoose.connect(appConfig.dbPath, {
}).catch(error => {
  console.error("Error connecting to database", error); //TODO: use winston logger
});



// Express app setup and configuration
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/documents', (req, res) => res.render('index'));

// app.use(
//   require("express-session")({
//     secret: appConfig.session.secret,
//     resave: false,
//     rolling: false,
//     saveUninitialized: true,  // To TO NEXT TIME
//     cookie: {
//       maxAge: 2592000000
//     },
//     store: new mongooseStore({
//       connection: appConfig.dbSessions,
//       mongoose: mongoose
//     })
//   })
// );

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Setup origin access rules
app.use(function (req, res, next) {
  req.accepts("*/*");
  req.acceptsEncodings(["gzip", "deflate", "sdch", "br"]);
  next();
});

// To allow cross origin access.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});


// Setup subdomain access.
app.use(subdomain("moe-gifts-api", apiRouter));

// If you don't want to use the subdomains.
app.use(apiRouter);

// Setup logging
app.use(morgan('dev', {
  skip: (req, res) => res.statusCode < 400
}));
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'rest_api.log'), { flags: 'a' })
}));
const PORT = process.env.PORT || 5000;
console.log('Environment: ', app.get('env'), '\nPort:', appConfig.port);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
