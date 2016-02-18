var express = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('message_db', 'root');

var PORT = process.env.NODE_ENV || 3000;

var app = express();

var Message = sequelize.define('Message', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 15],
        msg: "Please enter a name that isn't too long"
      },
      is: ["^[a-z]+$",'i']
    }
  },
  phone: {
    type: Sequelize.INTEGER,
    validate: {
      isInt: true,
    },
    allowNull: false
  },
  message: {
    type: Sequelize.TEXT,
    validate: {
      len: [5, 500],
      allowNull: false
    }
  }
});

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.post('/message', function(req, res) {
  Message.create(req.body).then(function(user) {
    res.redirect('/');
  }).catch(function(err) {
    res.redirect('/?msg=' + err.message);
  });
});

app.get('/', function(req, res) {
  Message.findAll().then(function(messages) {
    res.render('index', {
      messages: messages
    });
  });
});

sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("Listening at port %s", PORT);
  });
});