const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//For Heroku env varibale PORT is set on Heroku servers
const port = process.env.PORT || 3000;

var app = express();
//use takes middleware. here we are using express middleware
//with the below setting we don't need route for static contents.
// app.use - to register middleware. app.use takes one function. This function will be called with
// request object, response object and a third argument called next.
// next exists so you can tell express when the middleware function is done.



app.use((req, res, next) => {
  var now = new Date().toString();
  //console.log(`${now}: ${req.method} ${req.url}`)
  var log = `${now}: ${req.method} ${req.url}`;
  // fs.appendFile('server.log', log + '\n') --> this would throw warning in latest node versions
  // 'calling asynchronous function without callback is deprecated'
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log');
    }
  });

  next(); // if your middleware doesn't call next your route handlers are never going to be fired.

});

//maintenance middleware
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
//   //we don't call next so this middleware stops everything from being executed. We can call it
//   // maintenance middleware.
// });

app.use(express.static(__dirname + '/public'));


app.set('view engine', 'hbs');

//partials is for header and footer that is common across different pages
hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//views is the default directory that express uses for your templates.


app.get('/', (req, res) => {
  //res.send('<h1>Hello Express</h1>');

  // var result = {
  //   name: 'Nishant',
  //   likes: [
  //     'Biking',
  //     'Cities'
  //   ]
  // };
  //
  // res.send(result);
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    //currentYear: new Date().getFullYear(),
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  //res.send('About page');
  //passing data to the template is really simple, we just have to pass object as second argument to render
  //res.render('about.hbs');
  res.render('about.hbs', {
    pageTitle: 'About Page'
    //currentYear: new Date().getFullYear()
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});



app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
