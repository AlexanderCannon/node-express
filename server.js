const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

hbs.registerPartials(`${__dirname}/views/partials`);

app.set('view engine', 'hbs');

app.use((req, res, next) => {
  if (req.headers.maintain) {
    res.render('maintenance.hbs', {
      pageTitle: "App currently under maintenance"
    });
  } else {
    next();
  }
});

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url} from ${JSON.stringify(req.headers)}\n`;
  fs.appendFile('server.access.log', log, (err) => {
    console.log('Unable to write to server log')
  });
  next();
});


hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (str) => {
  return str.toUpperCase();
})

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: "Home Page",
    welcomeMessage: "Welcome to node/express with handlebars"
  });
});
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: "About Page"
  });
});
app.get('/bad', (req, res) => {
  res.send({
    error: "bad request."
  });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});