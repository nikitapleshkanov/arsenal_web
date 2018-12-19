const express = require('express');                      //         
const MongoClient    = require('mongodb').MongoClient; 
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const session = require('express-session');
const passport = require('passport'); 
const Auth0Strategy = require('passport-auth0');
const app = express()
const port = 8080;
const secured = require('./lib/middleware/secured');                   //из auth0
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var strategy = new Auth0Strategy(
    {
      domain: 'nikitaplshk.eu.auth0.com',
      clientID: '7n61nE8rl7vELJ7TeUDlYTmSS82AT855',
      clientSecret: 'MW7oxZ7R0Ui6eENqCib11A9Ynaf0FTINLswb64I-P7wq9l1zASrSoVwbUI_7fI9v',
      callbackURL:
        process.env.AUTH0_CALLBACK_URL || './callback'
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile);
    }
  );
  passport.use(strategy);
  // config express-session
var sess = {
    secret: '43F3viFHT',
    cookie: {},
    resave: false,
    saveUninitialized: true
  };
  if (app.get('env') === 'production') {
    sess.cookie.secure = true; // serve secure cookies, requires https
  }
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  app.use(session(sess));
  app.use(bodyParser.urlencoded({ extended: true })); 
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
  }), function (req, res) {
    res.redirect('/main');
  });
//   app.get('/logout', (req, res) => {
//     req.logout();
//  // console.log(req.logout());
//   res.redirect('/login');
//  });
  app.get('/callback', function (req, res, next) {
    passport.authenticate('auth0', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/main'); }
      req.logIn(user, function (err) {
        if (err) { return next(err); }
        const returnTo = req.session.returnTo;
        delete req.session.returnTo;
        
         res.redirect(returnTo || '/main');
        // res.redirect('/main');
      });
    })(req, res, next);
  });

// app.get('/login',  secured(),(req, res) => {
//     res.sendFile(__dirname + '/build/login.html')
  
// })
// app.get('/register', (req, res) => {
//     res.sendFile(__dirname + '/build/register.html')
  
// })

app.get('/main', (req, res) => {
    res.sendFile(__dirname + '/build/main.html')
  
})
app.get('/add_db',secured(), (req, res) => {
  res.sendFile(__dirname + '/build/add.html')

})
app.get('/history',secured(), (req, res) => {
    res.sendFile(__dirname + '/build/history.html')
  
})
app.get('/rait',secured(), (req, res) => {
    res.sendFile(__dirname + '/build/rait.html')
  
})
app.get('/matches',secured(), (req, res) => {
    res.sendFile(__dirname + '/build/matches.html')
  
})
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/main.html')
  
})
app.get('/export',secured(),(req, res) => {
  res.sendFile(__dirname + '/build/export.html')

})
app.get('/add_news', (req, res) => {
  // if (req.user.nickname==db.admin){ 
  //   res.sendFile(__dirname + '/build/admin_news.html'); 
  //   }else { 
  //   res.sendFile(__dirname + '/build/404.html'); 
  //   }
  res.sendFile(__dirname + '/build/add_news.html')
  
})
app.get('/accept_news',secured(), (req, res) => {
   if (req.user.nickname=="soeviysous1234"){ 
     res.sendFile(__dirname + '/build/accept_news.html'); 
     }else { 
     res.sendFile(__dirname + '/build/404.html'); 
     }
 
})
// app.get('/export/*', secured(),(req, res) => {
//   // console.log(req.url);
//   res.sendFile(__dirname+req.url)
//   // res.send('<a href="'+__dirname+req.url+'" download>Скачать файл </a>')

// })
app.use(bodyParser.urlencoded({ extended: true, })); 

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)

  require('./app/routes')(app, database);

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
}) 

module.exports.app = app;

